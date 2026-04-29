package com.example.demo;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class StudentRepository {

    private final JdbcTemplate jdbcTemplate;

    private final RowMapper<Student> studentRowMapper = this::mapStudent;

    public StudentRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Student save(Student student) {
        String sql = "INSERT INTO students (name, email, course) VALUES (?, ?, ?)";
        var keyHolder = new org.springframework.jdbc.support.GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            var preparedStatement = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            preparedStatement.setString(1, student.getName());
            preparedStatement.setString(2, student.getEmail());
            preparedStatement.setString(3, student.getCourse());
            return preparedStatement;
        }, keyHolder);

        Number key = keyHolder.getKey();
        if (key != null) {
            student.setId(key.intValue());
        }
        return student;
    }

    public List<Student> findAll() {
        return jdbcTemplate.query("SELECT id, name, email, course FROM students", studentRowMapper);
    }

    public Optional<Student> findById(Integer id) {
        String sql = "SELECT id, name, email, course FROM students WHERE id = ?";
        List<Student> students = jdbcTemplate.query(sql, studentRowMapper, id);
        return students.stream().findFirst();
    }

    public boolean update(Integer id, Student student) {
        String sql = "UPDATE students SET name = ?, email = ?, course = ? WHERE id = ?";
        int rows = jdbcTemplate.update(sql, student.getName(), student.getEmail(), student.getCourse(), id);
        return rows > 0;
    }

    public boolean deleteById(Integer id) {
        int rows = jdbcTemplate.update("DELETE FROM students WHERE id = ?", id);
        return rows > 0;
    }

    private Student mapStudent(ResultSet resultSet, int rowNumber) throws SQLException {
        return new Student(
                resultSet.getInt("id"),
                resultSet.getString("name"),
                resultSet.getString("email"),
                resultSet.getString("course")
        );
    }
}
