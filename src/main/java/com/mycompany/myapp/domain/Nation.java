package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A Nation.
 */
@Entity
@Table(name = "nation")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Nation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "nation")
    @JsonIgnoreProperties(value = { "comments", "nation", "actors", "topics" }, allowSetters = true)
    private Set<Movie> movies = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Nation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Nation name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Movie> getMovies() {
        return this.movies;
    }

    public void setMovies(Set<Movie> movies) {
        if (this.movies != null) {
            this.movies.forEach(i -> i.setNation(null));
        }
        if (movies != null) {
            movies.forEach(i -> i.setNation(this));
        }
        this.movies = movies;
    }

    public Nation movies(Set<Movie> movies) {
        this.setMovies(movies);
        return this;
    }

    public Nation addMovies(Movie movie) {
        this.movies.add(movie);
        movie.setNation(this);
        return this;
    }

    public Nation removeMovies(Movie movie) {
        this.movies.remove(movie);
        movie.setNation(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Nation)) {
            return false;
        }
        return getId() != null && getId().equals(((Nation) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Nation{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
