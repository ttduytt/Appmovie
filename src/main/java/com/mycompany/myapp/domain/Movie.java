package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

/**
 * A Movie.
 */
@Entity
@Table(name = "movie")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Movie implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "movie_name")
    private String movieName;

    @Column(name = "jhi_release")
    private LocalDate release;

    @Column(name = "author")
    private String author;

    @Column(name = "view")
    private Integer view;

    @Column(name = "description")
    private String description;

    @Column(name = "number_episode")
    private Integer numberEpisode;

    @Column(name = "avatar")
    private String avatar;

    @Column(name = "link_movie")
    private String linkMovie;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "movie")
    @JsonIgnoreProperties(value = { "movie" }, allowSetters = true)
    private Set<Comment> comments = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "movies" }, allowSetters = true)
    private Nation nation;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_movie__actors",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "actors_id")
    )
    @JsonIgnoreProperties(value = { "movies" }, allowSetters = true)
    private Set<Actor> actors = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "rel_movie__topics",
        joinColumns = @JoinColumn(name = "movie_id"),
        inverseJoinColumns = @JoinColumn(name = "topics_id")
    )
    @JsonIgnoreProperties(value = { "movies" }, allowSetters = true)
    private Set<Topic> topics = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Movie id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMovieName() {
        return this.movieName;
    }

    public Movie movieName(String movieName) {
        this.setMovieName(movieName);
        return this;
    }

    public void setMovieName(String movieName) {
        this.movieName = movieName;
    }

    public LocalDate getRelease() {
        return this.release;
    }

    public Movie release(LocalDate release) {
        this.setRelease(release);
        return this;
    }

    public void setRelease(LocalDate release) {
        this.release = release;
    }

    public String getAuthor() {
        return this.author;
    }

    public Movie author(String author) {
        this.setAuthor(author);
        return this;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Integer getView() {
        return this.view;
    }

    public Movie view(Integer view) {
        this.setView(view);
        return this;
    }

    public void setView(Integer view) {
        this.view = view;
    }

    public String getDescription() {
        return this.description;
    }

    public Movie description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getNumberEpisode() {
        return this.numberEpisode;
    }

    public Movie numberEpisode(Integer numberEpisode) {
        this.setNumberEpisode(numberEpisode);
        return this;
    }

    public void setNumberEpisode(Integer numberEpisode) {
        this.numberEpisode = numberEpisode;
    }

    public String getAvatar() {
        return this.avatar;
    }

    public Movie avatar(String avatar) {
        this.setAvatar(avatar);
        return this;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getLinkMovie() {
        return this.linkMovie;
    }

    public Movie linkMovie(String linkMovie) {
        this.setLinkMovie(linkMovie);
        return this;
    }

    public void setLinkMovie(String linkMovie) {
        this.linkMovie = linkMovie;
    }

    public Set<Comment> getComments() {
        return this.comments;
    }

    public void setComments(Set<Comment> comments) {
        if (this.comments != null) {
            this.comments.forEach(i -> i.setMovie(null));
        }
        if (comments != null) {
            comments.forEach(i -> i.setMovie(this));
        }
        this.comments = comments;
    }

    public Movie comments(Set<Comment> comments) {
        this.setComments(comments);
        return this;
    }

    public Movie addComments(Comment comment) {
        this.comments.add(comment);
        comment.setMovie(this);
        return this;
    }

    public Movie removeComments(Comment comment) {
        this.comments.remove(comment);
        comment.setMovie(null);
        return this;
    }

    public Nation getNation() {
        return this.nation;
    }

    public void setNation(Nation nation) {
        this.nation = nation;
    }

    public Movie nation(Nation nation) {
        this.setNation(nation);
        return this;
    }

    public Set<Actor> getActors() {
        return this.actors;
    }

    public void setActors(Set<Actor> actors) {
        this.actors = actors;
    }

    public Movie actors(Set<Actor> actors) {
        this.setActors(actors);
        return this;
    }

    public Movie addActors(Actor actor) {
        this.actors.add(actor);
        return this;
    }

    public Movie removeActors(Actor actor) {
        this.actors.remove(actor);
        return this;
    }

    public Set<Topic> getTopics() {
        return this.topics;
    }

    public void setTopics(Set<Topic> topics) {
        this.topics = topics;
    }

    public Movie topics(Set<Topic> topics) {
        this.setTopics(topics);
        return this;
    }

    public Movie addTopics(Topic topic) {
        this.topics.add(topic);
        return this;
    }

    public Movie removeTopics(Topic topic) {
        this.topics.remove(topic);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Movie)) {
            return false;
        }
        return getId() != null && getId().equals(((Movie) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Movie{" +
            "id=" + getId() +
            ", movieName='" + getMovieName() + "'" +
            ", release='" + getRelease() + "'" +
            ", author='" + getAuthor() + "'" +
            ", view=" + getView() +
            ", description='" + getDescription() + "'" +
            ", numberEpisode=" + getNumberEpisode() +
            ", avatar='" + getAvatar() + "'" +
            ", linkMovie='" + getLinkMovie() + "'" +
            "}";
    }
}
