import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { useState, useEffect } from 'react';

const CLIENT_ID = "0c3680d3999c4fce9773896b6bbfd6c0";
const CLIENT_SECRET = "ab78641e1d76471eb2bd440640475008";


function App() {
    const [searchInput, setSearchInput] = useState("");
    const [accessToken, setAccessToken] = useState("")

    useEffect(() => {
        //API Access Token
        var authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }
        fetch('https://accounts.spotify.com/api/token', authParameters )
            .then(result => result.json())
            .then(data => setAccessToken(data.access_token))
    }, [])

    // Search
    async function search() {
        console.log("Search for " + searchInput);
    }

    return (
        <div className="App">
            <Container>
                <InputGroup className="mb-3" size="lg">
                    <FormControl
                        placeholder="Search For Artist"
                        type="input"
                        onKeyDown={event => {
                            if (event.key == "Enter") {
                                search();
                            }
                        }}
                        onChange={event => setSearchInput(event.target.value)}
                    />
                    <Button onClick={search}>
                        Search
                    </Button>
                </InputGroup>
            </Container>
            <Container>
                <Row className="mx-2 row row-cols-4">
                    <Card>
                        <Card.Img src="#" />
                        <Card.Body>
                            <Card.Title>Album Name Here</Card.Title>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        </div>
    );
}

export default App;