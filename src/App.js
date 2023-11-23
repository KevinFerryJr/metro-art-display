import React, { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [artworks, setArtworks] = useState([]);

  async function fetchArtWithImages(){
    try {
      const response = await fetch(
        'https://collectionapi.metmuseum.org/public/collection/v1/search?q=a&hasImages=true'
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // console.log(data.objectIDs);
      //setValidIDs(data.objectIDs)
      loadArtwork(data.objectIDs)

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
  fetchArtWithImages()}, [])

    async function loadArtwork(ids) {
      const cards = [];
      
      let pageSize = 10
      let i = 0;

      // Loop for the amount of cards we want
      while (i < pageSize) {
        try {
          const response = await fetch(
            'https://collectionapi.metmuseum.org/public/collection/v1/objects/'+[ids[i]]
          );

          if (!response.ok) {
            pageSize++
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          console.log(data);

          if (data.title !== "" && data.primaryImage !== "" && data.artistDisplayName !== "") {
            // Push artwork data into the cards array
            cards.push(
              <Card
                key={data.objectID}
                title={data.title}
                artist={data.artistDisplayName}
                imageUrl={data.primaryImage}
              />
            );
            setArtworks(cards);
          }
          else{
            pageSize++;
          }
        } catch (error) {
          ++pageSize;
          console.error(error);
        }
        console.log(pageSize)
        console.log(i)
        ++i;
      }
    //Final render of the cards in the list
    setArtworks(cards);
    }

    // // Call the loadArtwork function
    // loadArtwork(validIDs);

  return (
    <div className="App">
      {/* Render the array of artwork cards */}
      {artworks}
    </div>
  );
}

function Card({ title, artist, imageUrl }) {
  return (
    <div className="card">
      <img src={imageUrl} alt={title} />
      <h2 id="art-title">{title}</h2>
      <h4 id="artist-name">Artist: {artist}</h4>
    </div>
  );
}
