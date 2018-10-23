import React, { Component } from "react";
import DeleteBtn from "../../components/DeleteBtn";
import SaveBtn from "../../components/SaveBtn";
import Jumbotron from "../../components/Jumbotron";
import API from "../../utils/API";
import { Link } from "react-router-dom";
import { Col, Row, Container } from "../../components/Grid";
import { List, ListItem } from "../../components/List";
import { Input, TextArea, FormBtn } from "../../components/Form";

class Articles extends Component {
  state = {
    articles: [],
    title: "",
    startdate: "",
    enddate: "",
    savedArticles: []
  };

  isValidDate = dateString => {

    var year = dateString.substring(0,4);
    var month = dateString.substring(4,6);
    var day = dateString.substring(6,8);
    var date = new Date(year, month-1, day);
    
    if (isNaN(date)){
      return false;
    } else {
      return true
    }
  }

  componentDidMount() {
    this.loadArticles();

  }

  deleteArticle = id => {
    API.deleteArticle(id)
      .then(res => this.loadArticles())
      .catch(err => console.log(err));
  };

  loadArticles = () => {
    API.getArticles()
      .then(res =>
        this.setState({ savedArticles: res.data}), console.log(this.state.  savedArticles)
      )
      .catch(err => console.log(err));
  };

  saveArticle = i => {
    API.saveArticle({
      title: this.state.articles[i].headline.main,
      synopsis: this.state.articles[i].snippet,
      date: this.state.articles[i].pub_date
      })
      .then(res => this.loadArticles(), console.log(this.state.articles[i]))
      .catch(err => console.log(err));
  
  };

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  scrapeArticles = () => {
    API.scrapeArticles()
      .then(res =>
        this.setState({ articles: res.data.response.docs, title: "", startdate: "", enddate: ""})
      )
      .catch(err => console.log(err));
  };

  handleFormSubmit = event => {
    event.preventDefault();

    if (this.isValidDate(this.state.startdate) && this.isValidDate(this.state.enddate)) {
      API.scrapeArticles(this.state.title, this.state.startdate, this.state.enddate)
      .then(res =>
        this.setState({ articles: res.data.response.docs, title: "", startdate: "", enddate: ""})
      )
      .catch(err => console.log(err));
    } else {
      alert("Invalid Date entered. Please enter in the format YYYYMMDD");
    }

  };


  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-12">
            <Jumbotron>
              <h1>New York Times Article Scrubber</h1>
              <h4> Search for and annotate articles of interest! </h4>
            </Jumbotron>

            <form>
              <Input
                value={this.state.title}
                onChange={this.handleInputChange}
                name="title"
                placeholder="Title"
              />
              <Input
                value={this.state.startdate}
                onChange={this.handleInputChange}
                name="startdate"
                placeholder="Start Year"
              />
              <TextArea
                value={this.state.enddate}
                onChange={this.handleInputChange}
                name="enddate"
                placeholder="End Year"
              />
              <FormBtn
                disabled={!(this.state.startdate && this.state.enddate && this.state.title)}
                onClick={this.handleFormSubmit}
              >
                Search Article
              </FormBtn>
            </form>
          </Col>
          <Col size="md-12">
            <Jumbotron>
              <h1>Results</h1>
            </Jumbotron>
            {this.state.articles.length ? (
              <List>
                {this.state.articles.map((article, i) => (
                  <ListItem key={article._id}>
                    {/* <Link to={"/articles/" + article._id}> */}
                      <strong>
                        {i}: {article.headline.main}
                      </strong>
                    {/* </Link> */}
                    <SaveBtn onClick={() => this.saveArticle(i)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
          {/* Saved stuff */}
          <Col size="md-12">
            <Jumbotron>
              <h1>Saved Articles</h1>
            </Jumbotron>
            {this.state.savedArticles.length ? (
              <List>
                {this.state.savedArticles.map((article, i) => (
                  <ListItem key={article._id}>
                    <Link to={"/articles/" + article._id}>
                      <strong>
                        {i}: {article.title}
                      </strong>
                    </Link>
                    <DeleteBtn onClick={() => this.deleteArticle(article._id)} />
                  </ListItem>
                ))}
              </List>
            ) : (
              <h3>No Results to Display</h3>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Articles;
