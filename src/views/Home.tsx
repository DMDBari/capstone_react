
import Container from 'react-bootstrap/Container';
import InputGroup from 'react-bootstrap/InputGroup';
import Card from 'react-bootstrap/Card';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { useState, useEffect } from 'react';

const CLIENT_ID = "0c3680d3999c4fce9773896b6bbfd6c0";
const CLIENT_SECRET = "ab78641e1d76471eb2bd440640475008";

type HomeProps = {
    isLoggedIn: boolean
}

export default function Home({ isLoggedIn }: HomeProps) {

    const [searchInput, setSearchInput] = useState("");
    const [accessToken, setAccessToken] = useState("")
    const [albums, setAlbums] = useState([])

    useEffect(() => {
        //API Access Token
        let authParameters = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
        }
        fetch('https://accounts.spotify.com/api/token', authParameters)
            .then(result => result.json())
            .then(data => setAccessToken(data.access_token))
    }, [])

    // Search
    async function search() {
        console.log("Search for " + searchInput);

        // Get request using search to get the Artist ID
        let searchParameters = {
            method: 'GET',
            headers: {
                'Content-Type': 'applicatoin/json',
                'Authorization': 'Bearer ' + accessToken
            }
        }
        let artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
            .then(response => response.json())
            .then(data => { return data.artists.items[0].id })
        // Get request with Artist ID grab all the albums from that artist
        let artistAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit48', searchParameters)
            .then(response => response.json())
            .then(data => {
                setAlbums(data.items);
            })
        // Display to the User
    }

    const disableSubmit = !isLoggedIn

    return (
        <>
            <Container>
                <InputGroup className="mb-3" size="lg">
                    <FormControl
                        placeholder="Search For Artist"
                        type="input"
                        onChange={event => setSearchInput(event.target.value)}
                    />
                    <Button onClick={search} disabled={disableSubmit}>Search</Button>
                </InputGroup>
            </Container>
            <Container>
                <Row className="mx-2 row row-cols-4">
                    {albums.map((album) => {
                        return (
                            <Card>
                                <Card.Img src={album.images[0].url} />
                                <Card.Body>
                                    <Card.Title>{album.name}</Card.Title>
                                </Card.Body>
                            </Card>
                        )
                    })}
                </Row>
            </Container>
        </>
    )
}