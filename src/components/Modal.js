import Modal from 'react-bootstrap/Modal';
import Video from './Video';
import Card from 'react-bootstrap/Card';
import Like from './Like';
import AddComment from './AddComment';
import Comments from './Comments';


function MyModal(props) {
    const { post, show, onHide,userData } = props;
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            restoreFocus={true}
        >
            <Modal.Body>
                <div className="modal-container">
                    <div className="video-container2">
                        <Video src={post.Purl} className="modal-video" />
                    </div>
                    <div className="comment-container">
                        <Card style={{ width: '15rem' }} className="card1">
                            <Card.Body>
                              <Comments post={post} />
                            </Card.Body>
                        </Card>
                        <Card style={{ width: '15rem' }} className="card2">
                            <Card.Body>
                                <Card.Text>
                                   <Like post={post} userData={userData} />
                                    {post.likes.length === 0 ? "" : "liked by " + post.likes.length + " users"}
                                </Card.Text>
                                <div style={{display: 'flex'}}>
                                   <AddComment post={post} userData={userData} />
                                </div>
                            </Card.Body>
                        </Card>

                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );


}

export default MyModal