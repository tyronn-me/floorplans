import React from 'react';
import { BrowserRouter, Routes , Route, NavLink, Link } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import logo from './logo.svg';
import './App.css';

const WP_Rest_Url = "http://tyronhayman.me/floorplans/wp-json/wp/v2/";
const API_pages = WP_Rest_Url + "pages";
const API_posts = WP_Rest_Url + "posts";

class App extends React.Component {

	constructor(props) {
      super(props);
  		this.state = {
        pages : [],
        title : null,
        content : null,
        image : null,
        type: null
  		}
    }

  componentDidMount() {

    let $this = this;
    let wpPagesArr = [];

    fetch(API_pages).then(function(response){
      if ( response.status !== 200 ) {
        console.log("Oh no, my code, its broken: " + response.status);
        return;
      }
      response.json().then(function(data){

        for(var i = 0; i < data.length; i++) {

          let tagArr = /(<([^>]+)>)/ig;

          if( data[i].acf.type == "front_page") {
            $this.setState({
              title : data[i].title.rendered,
              content : data[i].content.rendered.replace(tagArr, ""),
              image : data[i].fimg_url,
              type : data[i].acf.type
            });
          } else {
            wpPagesArr.push({
              "title" : data[i].title.rendered,
              "content" : data[i].content.rendered,
              "image" : data[i].fimg_url,
              "type" : data[i].acf.type
            });
          }

        }

        $this.setState({
          pages : wpPagesArr
        });

      });
    });

  }

  handleInputChange = e => {
	  e.preventDefault();

	}

	handleClick = e => {

	}

	render() {

    const wpPages = this.state.pages.map(function(wpPage, i) {
      let path = wpPage.title;
      return <Route key={i} path={path} element={<Page title={wpPage.title} content={wpPage.content} image={wpPage.image} type={wpPage.type} />}></Route>;
		});

    const wpPagesLinks = this.state.pages.map(function(wpPageLink, i) {
      let path = "/" + wpPageLink.title;
      return <li key={i} className="nav-item"><Link className="nav-link" to={path}>{wpPageLink.title}</Link></li>;
		});

		return (
      <BrowserRouter>
      <nav class="navbar navbar-light bg-light">
        <div class="container-fluid">
          <span class="navbar-brand mb-0 h1">Floorplans</span>
          <ul class="nav justify-content-end">
            <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
            {wpPagesLinks}
          </ul>
        </div>
      </nav>
        <TransitionGroup>
        <Routes>
          <Route path="/" element={<Page title={this.state.title} content={this.state.content} image={this.state.image} type={this.state.type} />}></Route>
        </Routes>
        </TransitionGroup>
      </BrowserRouter>
		);

	}

}

class Page extends React.Component {

  constructor(props) {
      super(props);
  		this.state = {
  		}
    }

  componentDidMount() {

  }

  handleInputChange = e => {
	  e.preventDefault();

	}

	handleClick = e => {

	}

	render() {

    let divStyle = {
      background: 'url(' + this.props.image + ') center top no-repeat',
      height : window.innerHeight + "px"
    }

    if ( this.props.type == "front_page" ) {

  		return (
        <CSSTransition
                  key={this.props.title}
                  appear
                  in
                  timeout={300}
                  classNames="page-transition"
                >
  			<div id="homepageContainer">
          <div id="homepageContent">
            <h1>{this.props.title}</h1>
            <p>{this.props.content}</p>
            <Link className="read-more-property" to="/">Explore the property <i class="fas fa-arrow-right"></i></Link>
          </div>
  			</div>
        </CSSTransition>
  		);
    } else {
      return (
        <CSSTransition
                  key={this.props.title}
                  appear
                  in
                  timeout={300}
                  classNames="page-transition"
                >
        <div id="interiorContainer">
          <div id="interiorLeft" style={divStyle}>
          </div>
          <div id="interiorRight">
      			<div className="container-fluid">
              <div className="row" id="interiorContent">
                <div className="col-md-12">
                  <h1 className="display-1">{this.props.title}</h1>
                  <div dangerouslySetInnerHTML={{__html: this.props.content }}></div>
                </div>
              </div>
      			</div>
          </div>
          <div className="clearFloats"></div>
        </div>
        </CSSTransition>
  		);
    }
	}

}

export default App;
