package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;

/**
 * A Comment.
 */
@Entity
@Table(name = "comment")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Comment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "content")
    private String content;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "jhi_like")
    private Integer like;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "comments", "nation", "actors", "topics" }, allowSetters = true)
    private Movie movie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties(value = { "comments" }, allowSetters = true)
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Comment id(Long id) {
        this.setId(id);
        return this;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Comment name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContent() {
        return this.content;
    }

    public Comment content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDate getDate() {
        return this.date;
    }

    public Comment date(LocalDate date) {
        this.setDate(date);
        return this;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getLike() {
        return this.like;
    }

    public Comment like(Integer like) {
        this.setLike(like);
        return this;
    }

    public void setLike(Integer like) {
        this.like = like;
    }

    public Movie getMovie() {
        return this.movie;
    }

    public void setMovie(Movie movie) {
        this.movie = movie;
    }

    public Comment movie(Movie movie) {
        this.setMovie(movie);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Comment)) {
            return false;
        }
        return getId() != null && getId().equals(((Comment) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Comment{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", content='" + getContent() + "'" +
            ", date='" + getDate() + "'" +
            ", like=" + getLike() +
            "}";
    }
}
