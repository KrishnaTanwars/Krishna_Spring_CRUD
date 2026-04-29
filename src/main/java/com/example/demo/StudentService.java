package com.example.demo;

import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class StudentService {

    private final StudentRepository repo;

    public StudentService(StudentRepository repo) {
        this.repo = repo;
    }

    public Student addStudent(Student s) {
        return repo.save(s);
    }

    public List<Student> getStudents() {
        return repo.findAll();
    }

    public Optional<Student> getStudentById(Integer id) {
        return repo.findById(id);
    }

    public Optional<Student> updateStudent(Integer id, Student student) {
        boolean updated = repo.update(id, student);
        if (!updated) {
            return Optional.empty();
        }
        return repo.findById(id);
    }

    public boolean deleteStudent(Integer id) {
        return repo.deleteById(id);
    }
}
