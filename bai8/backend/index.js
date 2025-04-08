const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Kết nối thất bại:', err.message);
    process.exit(1);
  }

  console.log('✅ Kết nối thành công!');

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100)
    )
  `;

  connection.query(createTableQuery, (err) => {
    if (err) {
      console.error('❌ Lỗi tạo bảng:', err.message);
      process.exit(1);
    }

    console.log('✅ Bảng "users" đã sẵn sàng.');

    const insertDataQuery = `
      INSERT INTO users (name, email)
      VALUES ('Alice', 'alice@example.com'),
             ('Bob', 'bob@example.com')
    `;

    connection.query(insertDataQuery, (err) => {
      if (err && err.code !== 'ER_DUP_ENTRY') {
        console.error('❌ Lỗi khi thêm dữ liệu:', err.message);
        process.exit(1);
      }

      console.log('✅ Dữ liệu mẫu đã được thêm.');

      connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
          console.error('❌ Lỗi khi truy vấn:', err.message);
        } else {
          console.log('📋 Danh sách người dùng:');
          console.table(results);
        }

        connection.end();
      });
    });
  });
});
