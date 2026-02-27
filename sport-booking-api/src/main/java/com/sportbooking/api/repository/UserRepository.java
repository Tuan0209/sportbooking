package com.sportbooking.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.sportbooking.api.entity.User;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, String id); // Kiểm tra email đã tồn tại trên user khác chưa
}
