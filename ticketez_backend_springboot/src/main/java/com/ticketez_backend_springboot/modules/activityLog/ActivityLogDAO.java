package com.ticketez_backend_springboot.modules.activityLog;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ActivityLogDAO extends JpaRepository<ActivityLog, Long> {

}
