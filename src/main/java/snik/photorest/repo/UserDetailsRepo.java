package snik.photorest.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import snik.photorest.domain.User;

public interface UserDetailsRepo extends JpaRepository<User, String> {
}
