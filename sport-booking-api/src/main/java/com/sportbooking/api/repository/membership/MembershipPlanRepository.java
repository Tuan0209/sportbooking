package com.sportbooking.api.repository.membership;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sportbooking.api.common.enums.Status;
import com.sportbooking.api.entity.membership.MembershipPlan;

@Repository
public interface MembershipPlanRepository extends JpaRepository<MembershipPlan, String> {

    List<MembershipPlan> findByStatusOrderByPriceAsc(Status status);

    List<MembershipPlan> findAllByOrderByPriceAsc();
}
