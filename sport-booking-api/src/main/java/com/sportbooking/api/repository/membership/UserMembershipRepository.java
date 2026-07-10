package com.sportbooking.api.repository.membership;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.common.enums.MembershipStatus;
import com.sportbooking.api.entity.membership.UserMembership;

@Repository
public interface UserMembershipRepository extends JpaRepository<UserMembership, String> {

    Optional<UserMembership> findFirstByUserIdAndStatusAndEndDateAfterOrderByEndDateDesc(
            String userId, MembershipStatus status, LocalDateTime now);

    void deleteByPlanId(String planId);
}
