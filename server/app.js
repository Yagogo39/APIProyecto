const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: 'sql10.freesqldatabase.com',
  user: 'sql10785119',
  password: 'm5EA4FFDQT',
  database: 'sql10785119',
  port: 3306
};

// Endpoint de registro con UUID de estudiante
app.post('/api/register/student', async (req, res) => {
  const { user, participant, student } = req.body;
  let connection;

  try {
    // 1. Establecer conexión
    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    // 2. Generar UUID para el usuario
    const userId = uuidv4();
    console.log('UUID generado:', userId);

    // 3. Insertar usuario con UUID
    const [userResult] = await connection.execute(
      'INSERT INTO Users (IDUser, Username, Userpassword) VALUES (?, ?, ?)',
      [userId, user.username, user.password]
    );

    // 4. Insertar en Participants
    await connection.execute(
      'INSERT INTO Participants (IDParticipant, NameParticipant, LastName_1, LastName_2, Category, IDUser) VALUES (?, ?, ?, ?, ?, ?)',
      [participant.rfid, participant.name, participant.lastName1, participant.lastName2, 'estudiante', userId]
    );

    // 5. Insertar en Student
    await connection.execute(
      'INSERT INTO Student (IDParticipant, Major, Semester) VALUES (?, ?, ?)',
      [participant.rfid, student.major, student.semester]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      userId,
      participantId: participant.rfid
    });

  } catch (err) {
    if (connection) {
      await connection.rollback();
      await connection.end();
    }

    console.error('Error en el registro:', {
      message: err.message,
      code: err.code,
      sql: err.sql
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(data.error || 'Error en el registro');
    }

    navigate('/registro-exitoso');


    let errorMessage = 'Error en el registro';
    let statusCode = 500;

    if (err.code === 'ER_DUP_ENTRY') {
      statusCode = 400;
      if (err.message.includes('Users.Username')) {
        errorMessage = 'El nombre de usuario ya está en uso';
      } else if (err.message.includes('Participants.IDParticipant')) {
        errorMessage = 'El RFID ya está registrado';
      }
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Endpoint de registro con UUID para administrativos
app.post('/api/register/administrative', async (req, res) => {
  const { user, participant, administrative } = req.body;
  let connection;

  try {
    // 1. Establecer conexión
    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    // 2. Generar UUID para el usuario
    const userId = uuidv4();
    console.log('UUID generado:', userId);

    // 3. Insertar usuario con UUID
    const [userResult] = await connection.execute(
      'INSERT INTO Users (IDUser, Username, Userpassword) VALUES (?, ?, ?)',
      [userId, user.username, user.password]
    );

    // 4. Insertar en Participants
    await connection.execute(
      'INSERT INTO Participants (IDParticipant, NameParticipant, LastName_1, LastName_2, Category, IDUser) VALUES (?, ?, ?, ?, ?, ?)',
      [participant.rfid, participant.name, participant.lastName1, participant.lastName2, 'Administrador/Docente', userId]
    );

    // 5. Insertar en AdminTeacher (tabla para administrativos)
    await connection.execute(
      'INSERT INTO AdminTeacher (IDParticipant, Rol, Major) VALUES (?, ?, ?)',
      [participant.rfid, administrative.rol, administrative.major]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      userId,
      participantId: participant.rfid,
      userType: 'administrative'
    });

  } catch (err) {
    if (connection) {
      await connection.rollback();
      await connection.end();
    }

    console.error('Error en el registro administrativo:', {
      message: err.message,
      code: err.code,
      sql: err.sql
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(data.error || 'Error en el registro');
    }

    navigate('/registro-exitoso');

    let errorMessage = 'Error en el registro administrativo';
    let statusCode = 500;

    if (err.code === 'ER_DUP_ENTRY') {
      statusCode = 400;
      if (err.message.includes('Users.Username')) {
        errorMessage = 'El nombre de usuario ya está en uso';
      } else if (err.message.includes('Participants.IDParticipant')) {
        errorMessage = 'El RFID ya está registrado';
      } else if (err.message.includes('AdminTeacher.IDParticipant')) {
        errorMessage = 'Error al registrar los datos administrativos';
      }
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// Endpoint de registro con UUID para libres
app.post('/api/register/libre', async (req, res) => {
  const { user, participant } = req.body;
  let connection;

  try {
    // 1. Establecer conexión
    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    // 2. Generar UUID para el usuario
    const userId = uuidv4();
    console.log('UUID generado:', userId);

    // 3. Insertar usuario con UUID
    const [userResult] = await connection.execute(
      'INSERT INTO Users (IDUser, Username, Userpassword) VALUES (?, ?, ?)',
      [userId, user.username, user.password]
    );

    // 4. Insertar en Participants
    await connection.execute(
      'INSERT INTO Participants (IDParticipant, NameParticipant, LastName_1, LastName_2, Category, IDUser) VALUES (?, ?, ?, ?, ?, ?)',
      [participant.rfid, participant.name, participant.lastName1, participant.lastName2, 'libre', userId]
    );


    await connection.commit();

    res.status(201).json({
      success: true,
      userId,
      participantId: participant.rfid
    });

  } catch (err) {
    if (connection) {
      await connection.rollback();
      await connection.end();
    }

    console.error('Error en el registro:', {
      message: err.message,
      code: err.code,
      sql: err.sql
    });

    const data = await response.json();
    console.log(data);

    if (!response.ok) {
      throw new Error(data.error || 'Error en el registro');
    }

    navigate('/registro-exitoso');



    let errorMessage = 'Error en el registro';
    let statusCode = 500;

    if (err.code === 'ER_DUP_ENTRY') {
      statusCode = 400;
      if (err.message.includes('Users.Username')) {
        errorMessage = 'El nombre de usuario ya está en uso';
      } else if (err.message.includes('Participants.IDParticipant')) {
        errorMessage = 'El RFID ya está registrado';
      }
    }

    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor API corriendo en http://localhost:${PORT}`);
});