import React, { Component } from 'react';
import './index.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


class DelayLink extends React.Component {
    static propTypes = {
      /**
       * Milliseconds to wait before registering the click.
       */
      delay:        PropTypes.number,
      /**
       * Called after the link is clicked and before the delay timer starts.
       */
      onDelayStart: PropTypes.func,
      /**
       * Called after the delay timer ends.
       */
      onDelayEnd:   PropTypes.func
    };
  
    static defaultProps = {
      delay:        0,
      onDelayStart: () => {},
      onDelayEnd:   () => {}
    };
  
    static contextTypes = Link.contextTypes;
  
    constructor(props) {
      super(props);
      this.timeout = null;
    }
  
    componentWillUnmount() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
    }
  
    /**
     * Called when the link is clicked
     *
     * @param {Event} e
     */
    handleClick = (e) => {
      const { replace, to, delay, onDelayStart, onDelayEnd } = this.props;
      const { history } = this.context.router;
  
      onDelayStart(e, to);
      if (e.defaultPrevented) {
        return;
      }
      e.preventDefault();
  
      this.timeout = setTimeout(() => {
        if (replace) {
          history.replace(to);
        } else {
          history.push(to);
        }
        onDelayEnd(e, to);
      }, delay);
    };
  
    render() {
      const props = Object.assign({}, this.props);
      delete props.delay;
      delete props.onDelayStart;
      delete props.onDelayEnd;
  
      return (
        <Link {...props} onClick={this.handleClick} />
      );
    }
  }


class EditNote extends Component {
    
    state = {
        matched: [],
        title: '',
        content: ''
    }


    





    findMatch = () => {
        console.log("state title", this.state.title)
        console.log('props match', this.props.state.notes)
        let routeId = this.props.match.params.id;
        console.log("routeID", routeId, "typeof routeID:", typeof routeId);
        let matched = this.props.state.notes.filter( (item) => {
            console.log('item.id:', item.id, 'routeid:', routeId, 'item.id == routeId:', item.id == routeId);
            return item.id == routeId; 
        });
        console.log('matched:', matched);
        this.setState({ matched: matched });
        console.log("match?", this.state.matched);
        // let note = this.props.state.notes[0].title;
        // console.log(note);
    }


    componentDidMount = () => {
        let routeId = this.props.match.params.id;
        let matched = this.props.state.notes.filter( (item) => {
            return item.id == routeId; 
        });
        this.setState({ matched: matched[0] });
        this.setState({ title: matched[0].title})
        this.setState({ content: matched[0].content})

    }



    handleChange = (event) => {
        console.log(event.target.name, event.target.value)
        this.setState({[event.target.name]: event.target.value})

        // let temp = Array.from(this.state.matched);
        // temp[0][event.target.name] = event.target.value;
        // this.setState({ matched: temp })
    }

    redirect = () => {
        window.location.assign('/')
    }


    cancelButton = () => {
        window.location.reload();
    }



    render() {
        
        return (
            <div className='edit_view'>
                <form className="edit_form" onSubmit={this.edit}>
                        <br /><br />
                <h3 className="edit_header">Edit Note: </h3>

                        <br />

                    <input 
                        className="edit_title" 
                        type="text" 
                        onChange={this.handleChange}
                        value={this.state.title}
                        name='title'
                    />

                            <br /><br />

                    <textarea 
                        className="edit_content" 
                        rows="20" 
                        onChange={this.handleChange} 
                        value={this.state.content}
                        name='content'
                    />
                    
                    <br />

                    {/* <Link to="/"> */}
                    <button type="submit"
                        className="edit_button"
                        onClick={this.redirect}
                        
                            >Update
                    </button>
                    {/* </Link> */}
                    <button 
                        className="cancel_button"
                        onClick={this.cancelButton}
                        
                            >Undo Changes
                    </button>

                </form>
            </div>
        )
    }

    edit = event => { 
        event.preventDefault();
        console.log("EN history", this.state.matched)
        const noteObj = {
            title: this.state.title,
            content: this.state.content
        }
        
        axios
            .put(`http://localhost:5000/notes/${this.state.matched.id}`, noteObj)
            .then(res => {
                console.log("data?", res.data);
                // window.location.reload();
            })
            .catch(err => {
                console.log(err, 'err')
        });

    };



}

//action 3/3
// export default connect(mapStateToProps, {editNote})(EditNote);
export default EditNote;

