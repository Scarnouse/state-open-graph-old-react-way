//The following code block explains in order to login to
//user's Facebook account and call the function internally
//(loginAndlLoadUserLikes) if sucessfully connected.
function checkLoginStatusAndLoadUserLikes() {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
      loadUserAndLikes();
    } else {
      loginAndlLoadUserLikes();
    }
  });
}

function loginAndlLoadUserLikes() {
  FB.login(function(response) {
    loadUserAndLikes();
  }, {scope: 'user_likes'});
}

//Once logged in, this method shoul load the details of
//the specific user.
var UserDetails = React.createClass({
  render: function() {
    return (
      <section id="user-details">
        <a href={this.props.userDetails.link} target="__blank">
          {this.props.userDetails.name}
        </a>
        {' | '}
        <a href="#" onClick={this.handleLogout}>Logout</a>
      </section>
    )
  },
  //Specified user should be able to logout from the respective
  //account
  handleLogout: function() {
    FB.logout(function(){
      window.location.reload();
    });
    return false;
  }
});

//Once logged in, this method should load the likes pages
//of the specific user.
function loadUserAndLikes () {
  FB.api('/me', function(userResponse) {
    React.render(<UserDetails userDetails={userResponse} />,
      document.getElementById('user'));

    var fields = { fields: 'category,name,picture.type(normal)'};
    FB.api('/me/likes', fields, function(likesResponse) {
      React.render(<UserLikesList list={likesResponse.data} />,
        document.getElementById('main'));
    });
  });
}

//Once logged in, this method should list the liked pages
//of the specific user.
var UserLikesList = React.createClass({
  render: function() {
    var items = this.props.list.map(function (likeObject) {
      return <UserLikeItem data={likeObject} />;
    });

    return (
      <ul id="user-likes-list">
        {items}
      </ul>
    );
  }
});
var UserLikeItem = React.createClass({
  getInitialState: function() {
    return {data_name: this.props.data.name};
  },
  handleClick: function(){
    this.setState({
      data_name: 'I liked it'
    })
  },
  render: function() {
    var props_data = this.props.data;

    return (
      <div onClick={this.handleClick}>
        <img src={props_data.picture.data.url}
        title={props_data.name} />
        <h1> {this.state.data_name}
          <small>{props_data.category}</small>
        </h1>
      </div>
    );
  }
});