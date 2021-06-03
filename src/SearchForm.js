import React, { Component } from "react";
import { MdFileDownload } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
const uuidv4 = require("uuid/v4");

let apiKey = "586f619dd0e85124d92b3770517244f0370a5606f7e7068d1e735857c0ce86de";

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      page: 1,
      images: [],
      cols: 3,
      showUnsplashFooter: false,
      maxPages: 6,
    };
    window.onscroll = () => {
      if (
        //checks to see if the scroll bar is precisely between 79% and 80% of the way to the bottom,
        // or if the has already reached the bottom
        (window.innerHeight + Math.round(document.documentElement.scrollTop) >=
          document.documentElement.offsetHeight * 0.79 &&
          window.innerHeight + Math.round(document.documentElement.scrollTop) <=
            document.documentElement.offsetHeight * 0.8) ||
        window.innerHeight + Math.round(document.documentElement.scrollTop) ===
          document.documentElement.offsetHeight
      ) {
        if (this.state.page >= this.state.maxPages) {
          if (
            window.innerHeight +
              Math.round(document.documentElement.scrollTop) >=
            document.documentElement.offsetHeight * 0.98
          ) {
            this.setState({ showUnsplashFooter: true });
          }
          return;
        }
        this.setState({ page: this.state.page + 1 });
        if (this.state.searchInput === "") {
          this.loadDefaultScroll();
        } else {
          this.loadSearchScroll();
        }
      }
    };
  }
  componentDidMount() {
    this.loadDefault();

    window.addEventListener("resize", () => {
      let winWidth = Math.max(
        document.documentElement.clientWidth,
        window.innerWidth || 0
      );
      if (winWidth <= 900 && winWidth > 600) {
        this.setState({ cols: 2 });
      } else if (winWidth <= 600) {
        this.setState({ cols: 0 });
      } else {
        this.setState({ cols: 3 });
      }
    });
  }

  loadDefault = async () => {
    let response = await fetch(
      `https://api.unsplash.com/photos/?per_page=22&client_id=${apiKey}`
    );
    let body = await response.text();
    body = JSON.parse(body);
    this.setState({ images: body });
  };

  loadSearchScroll = async () => {
    let response = await fetch(
      `https://api.unsplash.com/search/photos?page=${this.state.page}&per_page=22&query=${this.state.searchInput}&client_id=${apiKey}`
    );
    let body = await response.text();
    body = JSON.parse(body);
    this.setState({ images: this.state.images.concat(body.results) });
  };
  loadDefaultScroll = async () => {
    let response = await fetch(
      `https://api.unsplash.com/photos/?page=${this.state.page}&per_page=22&client_id=${apiKey}`
    );
    let body = await response.text();
    body = JSON.parse(body);
    this.setState({ images: this.state.images.concat(body) });
  };

  handleTextChange = (evt) => {
    this.setState({ searchInput: evt.target.value });
  };

  submitForm = async (evt) => {
    evt.preventDefault();
    if (this.state.searchInput === "") {
      this.setState({ page: 1, showUnsplashFooter: false });
      return this.loadDefault();
    }
    let response = await fetch(
      `https://api.unsplash.com/search/photos?page=1&per_page=22&query=${this.state.searchInput}&client_id=${apiKey}`
    );
    let body = await response.text();
    body = JSON.parse(body);
    this.setState({
      images: body.results,
      showUnsplashFooter: false,
      page: 1,
    });
  };

  downloadImage = async (downloadUrl) => {
    let response = await fetch(downloadUrl + `?client_id=${apiKey}`);
    let body = await response.text();
    console.log("download image body:", body);
  };

  render = () => {
    //Seperates each of the images into seperate columns for proper massonry grid display depending on screenwidth
    let colOne = [];
    let colTwo = [];
    let colThree = [];
    this.state.images.forEach((image, index) => {
      let array = colOne;
      if (index % this.state.cols === 1) {
        array = colTwo;
      }
      if (index % this.state.cols === 2) {
        array = colThree;
      }
      array.push(
        <div className="image-container" key={uuidv4()}>
          <img
            src={image.urls.small}
            alt={image.description}
            onClick={() => {
              console.log("INDEX:", index, " image:", image);
            }}
          />
          <a
            className="download-button"
            href={image.links.download + "?force=true"}
            download
            onClick={() => {
              this.downloadImage(image.links.download_location);
            }}
            target="_blank"
            rel="noopener noreferrer">
            <MdFileDownload />
          </a>
          <a
            href={image.user.links.html}
            target="_blank"
            rel="noopener noreferrer">
            {" "}
            <p className="user-name">{image.user.name}</p>
          </a>
        </div>
      );
    });
    return (
      <div>
        <form onSubmit={this.submitForm}>
          <img src="UnsplashLogo.png" alt="Unsplash logo"></img>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for images on Unsplash!"
              onChange={this.handleTextChange}
              value={this.state.searchInput}></input>
            <input type="submit" id="image-search"></input>
            <label htmlFor="image-search">
              <AiOutlineSearch />
            </label>
          </div>
        </form>

        <div className="gallery">
          <div className="col-one">{colOne}</div>
          <div className="col-two">{colTwo}</div>
          <div className="col-three">{colThree}</div>
          {this.state.showUnsplashFooter && (
            <footer>
              <div className="unsplash-pop-up">
                <span
                  onClick={() => this.setState({ showUnsplashFooter: false })}
                  className="close">
                  X
                </span>
                <p>Visit Unsplash for more!</p>
                <a className="unsplash-button" href="https://unsplash.com/">
                  <img src="UnsplashLogo.png" alt="Unsplash logo"></img>
                </a>
              </div>
            </footer>
          )}
        </div>
      </div>
    );
  };
}

export default SearchForm;
