package com.sportbooking.api.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.user.entity.User;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsByEmail(String email);

    boolean existsByEmailAndIdNot(String email, String id); // Kiểm tra email đã tồn tại trên user khác chưa
    // viet tat cua sql la: select count(*) > 0 from user where email = ? and id !=
    // ?
}
