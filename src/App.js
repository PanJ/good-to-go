import React, { Component } from "react";
import "./App.css";
import * as firebase from "firebase";

const isAdmin = user => user.email === "panjmp@gmail.com";

class App extends Component {
  state = {
    loggedIn: false,
    loggedInAsUser: false,
    loggedInAsAdmin: false,
    goodToGoed: false
  };
  componentDidMount() {
    firebase.initializeApp({
      apiKey: "AIzaSyDJ0wY9oshKv1dHJm2uCX7AoY2MyILngJM",
      authDomain: "good-to-go-650dd.firebaseapp.com",
      databaseURL: "https://good-to-go-650dd.firebaseio.com",
      projectId: "good-to-go-650dd",
      storageBucket: "",
      messagingSenderId: "1034021531413"
    });
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const admin = isAdmin(user);
        this.setState({
          user: user,
          loggedIn: true,
          loggedInAsUser: !admin,
          loggedInAsAdmin: admin
        });
        if (admin) {
          database.ref("goodToGoers").once("value", snapshot => {
            this.setState({
              goodToGoers: snapshot.val()
            });
          });
        }
      } else {
        this.setState({
          loggedIn: false,
          loggedInAsUser: false,
          loggedInAsAdmin: false
        });
      }
    });
    const database = firebase.database();
    database.ref("goodToGoers").on("value", snapshot => {
      const value = snapshot.val();
      const { loggedIn, user } = this.state;
      if (loggedIn) {
        if (isAdmin(user)) {
        } else {
        }
      } else {
        this.setState({
          goodToGoed: false
        });
      }
      if (this.state.loggedIn && value && value[this.state.user.uid]) {
        this.setState({
          goodToGoed: true
        });
      } else {
        const { user } = this.state;
        if (user) {
          if (isAdmin(user)) {
            this.setState({
              goodToGoers: value
            });
          } else {
            database.ref(`goodToGoers/${user.uid}`).set(false);
          }
        }
        this.setState({
          goodToGoed: false
        });
      }
    });
  }
  goodTogo = () => {
    const { user } = this.state;
    const database = firebase.database();
    database.ref(`goodToGoers/${user.uid}`).set(true);
  };
  changedMyMind = () => {
    const { user } = this.state;
    const database = firebase.database();
    database.ref(`goodToGoers/${user.uid}`).set(false);
  };
  reset = () => {
    const database = firebase.database();
    database.ref("goodToGoers").remove();
  };
  login = () => {
    const provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider);
  };
  logout = () => {
    firebase.auth().signOut();
  };
  render() {
    return (
      <section className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Good-to-go?</h1>
            {!this.state.loggedIn && (
              <div>
                <button
                  onClick={this.login}
                  className="button is-large is-primary"
                >
                  Login with GitHub
                </button>
              </div>
            )}
            {this.state.loggedInAsUser && (
              <div>
                {this.state.goodToGoed ? (
                  <div>
                    <p>Well done !!!</p>
                    <p>Please wait for our friends...</p>
                    <button
                      onClick={this.changedMyMind}
                      className="button is-danger"
                    >
                      Changed my mind...
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={this.goodTogo}
                    className="button is-large is-primary"
                  >
                    Good-to-go!
                  </button>
                )}
              </div>
            )}
            {this.state.loggedInAsAdmin && (
              <div>
                <p>Good-to-goers:</p>
                <p className="title">
                  {
                    Object.keys(this.state.goodToGoers || {}).filter(
                      key => this.state.goodToGoers[key]
                    ).length
                  }{" "}
                  / {Object.keys(this.state.goodToGoers || {}).length}
                </p>
                <button
                  onClick={this.reset}
                  className="button is-large is-primary"
                >
                  Reset
                </button>
              </div>
            )}
            {this.state.loggedIn && (
              <button onClick={this.logout} className="button is-small">
                Logout
              </button>
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default App;
