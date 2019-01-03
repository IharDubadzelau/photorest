package snik.photorest.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import snik.photorest.domain.Message;

public interface MessageRepo extends JpaRepository<Message, Long> {
}
