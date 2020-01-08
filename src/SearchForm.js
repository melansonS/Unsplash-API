import React, { Component } from "react";

let apiKey = "586f619dd0e85124d92b3770517244f0370a5606f7e7068d1e735857c0ce86de";

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      viewing: "default",
      page: 1,
      images: [],
      showUnsplashFooter: false
    };
    window.onscroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        if (this.state.page >= 4) {
          this.setState({ showUnsplashFooter: true });
          return;
        }
        // Do awesome stuff like loading more content!
        this.setState({ page: this.state.page + 1 });
        if (this.state.viewing === "default") {
          this.loadDefaultScroll();
        } else {
          this.loadSearchScroll();
        }
      }
    };
  }
  componentDidMount() {
    this.loadDefault();
  }
  loadDefault = async () => {
    let response = await fetch(
      `https://api.unsplash.com/photos/?per_page=12&client_id=${apiKey}`
    );
    let body = await response.text();
    body = JSON.parse(body);
    this.setState({ images: body });
  };

  submitForm = async evt => {
    evt.preventDefault();
    let response = await fetch(
      `https://api.unsplash.com/search/photos?page=1&per_page=12&query=${this.state.searchInput}&client_id=${apiKey}`
    );
    let body = await response.text();
    body = JSON.parse(body);
    this.setState({
      images: body.results,
      viewing: this.state.searchInput,
      searchInput: "",
      page: 1
    });
  };
  handleTextChange = evt => {
    this.setState({ searchInput: evt.target.value });
  };

  loadSearchScroll = async () => {
    let response = await fetch(
      `https://api.unsplash.com/search/photos?page=${this.state.page}&per_page=12&query=${this.state.viewing}&client_id=${apiKey}`
    );
    let body = await response.text();
    body = JSON.parse(body);
    this.setState({ images: this.state.images.concat(body.results) });
  };
  loadDefaultScroll = async () => {
    let response = await fetch(
      `https://api.unsplash.com/photos/?per_page=12&page=${this.state.page}&client_id=${apiKey}`
    );
    let body = await response.text();
    body = JSON.parse(body);
    this.setState({ images: this.state.images.concat(body) });
  };

  render = () => {
    return (
      <div>
        <form onSubmit={this.submitForm}>
          <h4>Search for an image</h4>
          <input
            type="text"
            onChange={this.handleTextChange}
            value={this.state.searchInput}
          ></input>
          <input type="submit"></input>
        </form>

        <div className="image-container">
          {this.state.images.map(image => {
            return <img src={image.urls.small} />;
          })}
        </div>
        {this.state.showUnsplashFooter && <div>Visit unsplash for more!</div>}
      </div>
    );
  };
}

export default SearchForm;
