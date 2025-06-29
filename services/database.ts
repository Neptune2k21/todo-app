import * as SQLite from 'expo-sqlite';

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async init() {
    this.db = await SQLite.openDatabaseAsync('tasks.db');
    await this.createTables();
  }

  private async createTables() {
    if (!this.db) return;

    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        completedAt TEXT
      );
    `);
  }

  async getAllTasks(showCompleted: boolean = true): Promise<Task[]> {
    if (!this.db) return [];

    const query = showCompleted 
      ? 'SELECT * FROM tasks ORDER BY createdAt ASC'
      : 'SELECT * FROM tasks WHERE completed = 0 ORDER BY createdAt ASC';

    const result = await this.db.getAllAsync(query);
    return result.map(row => {
      const taskRow = row as any;
      return {
        ...taskRow,
        completed: Boolean(taskRow.completed)
      };
    }) as Task[];
  }

  async addTask(title: string, description?: string): Promise<void> {
    if (!this.db) return;

    await this.db.runAsync(
      'INSERT INTO tasks (title, description, createdAt) VALUES (?, ?, ?)',
      [title, description || '', new Date().toISOString()]
    );
  }

  async updateTask(id: number, title: string, description?: string): Promise<void> {
    if (!this.db) return;

    await this.db.runAsync(
      'UPDATE tasks SET title = ?, description = ? WHERE id = ?',
      [title, description || '', id]
    );
  }

  async toggleTaskCompletion(id: number): Promise<void> {
    if (!this.db) return;

    const task = await this.db.getFirstAsync('SELECT completed FROM tasks WHERE id = ?', [id]) as { completed: number };
    const newCompleted = task.completed ? 0 : 1;
    const completedAt = newCompleted ? new Date().toISOString() : null;

    await this.db.runAsync(
      'UPDATE tasks SET completed = ?, completedAt = ? WHERE id = ?',
      [newCompleted, completedAt, id]
    );
  }

  async deleteTask(id: number): Promise<void> {
    if (!this.db) return;

    await this.db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
  }

  async resetDatabase(): Promise<void> {
    if (!this.db) return;

    await this.db.execAsync('DELETE FROM tasks');
  }

  async insertTestData(): Promise<void> {
    const testTasks = [
      { title: 'Faire les courses', description: 'Acheter du pain, lait et légumes' },
      { title: 'Terminer le projet', description: 'Finaliser l\'application de tâches' },
      { title: 'Appeler le dentiste', description: 'Prendre rendez-vous pour un contrôle' },
      { title: 'Lire un livre', description: 'Continuer la lecture du roman en cours' },
      { title: 'Faire du sport', description: 'Séance de cardio 30 minutes' }
    ];

    for (const task of testTasks) {
      await this.addTask(task.title, task.description);
    }
  }
}

export const databaseService = new DatabaseService();