import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const poolPromise = sql.connect(config)
  .then(pool => {
    console.log("✔ Conectado a SQL Server");
    return pool;
  })
  .catch(err => {
    console.error("❌ Error al conectar a SQL Server", err);
    throw err;
  });

export const db = {
  /**
   * Usa placeholders: ?
   * Ejemplo: db.query("SELECT * FROM users WHERE id = ?", [10])
   */
  query: async (sqlString: string, params: any[] = []) => {
    const pool = await poolPromise;

    // Reemplazar ? por @p0, @p1, ...
    let parsed = sqlString;
    params.forEach((_, i) => {
      parsed = parsed.replace("?", `@p${i}`);
    });

    const req = pool.request();
    params.forEach((value, i) => {
      req.input(`p${i}`, value);
    });

    const result = await req.query(parsed);

    // 🔥 DEVOLVEMOS SOLO UN ARRAY SIEMPRE
    return result.recordset;
  }
};
