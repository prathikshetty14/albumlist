import React, { useState, useEffect } from 'react';

function AlbumManager() {

    // State variables to manage albums, new album title, selected album ID, and edit mode
    const [albums, setAlbums] = useState([]);
    const [newAlbumTitle, setNewAlbumTitle] = useState('');
    const [selectedAlbumId, setSelectedAlbumId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);


    // Use the useEffect hook to fetch albums from the API when the component mounts
    useEffect(() => {
        // Fetch albums from the API
        fetch('https://jsonplaceholder.typicode.com/albums')
        .then((response) => response.json())
        .then((data) => setAlbums(data));
    }, []);


    // Function to add a new album
    const addAlbum = () => {
        // Perform a POST request (dummy request)
        fetch('https://jsonplaceholder.typicode.com/albums', {
        method: 'POST',
        body: JSON.stringify({
            title: newAlbumTitle,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        })
        .then((response) => response.json())
        .then((data) => {

            // Prepend the new album to the beginning of the albums array
            setAlbums([data, ...albums]);
            setNewAlbumTitle('');
        });
    };


    // Function to toggle edit mode for an album
    const toggleEdit = (albumId) => {
        if (albumId === selectedAlbumId) {
            updateAlbum();
        } else {
            setSelectedAlbumId(albumId);
        }
        setIsEditing(!isEditing);
    };


    // Function to update an album
    const updateAlbum = () => {
        if (selectedAlbumId !== null) {

            // Find the selected album by its ID
            const updatedAlbum = albums.find((album) => album.id === selectedAlbumId);

            // Perform a PUT request to update the album name
            fetch(`https://jsonplaceholder.typicode.com/albums/${selectedAlbumId}`, {
                method: 'PUT',
                body: JSON.stringify({
                title: newAlbumTitle,
                }),
                headers: {
                'Content-type': 'application/json; charset=UTF-8',
                },
            })
                .then((response) => response.json())
                .then(() => {
                    // Update the album's name in the state
                    setAlbums((prevAlbums) =>
                        prevAlbums.map((album) =>
                        album.id === selectedAlbumId ? { ...album, title: newAlbumTitle } : album
                        )
                    );

                    // Clear the input and reset the selected album
                    setNewAlbumTitle('');
                    setSelectedAlbumId(null);
                });
        }
    };

   
    // Function to delete an album    
    const deleteAlbum = (albumId) => {
        fetch(`https://jsonplaceholder.typicode.com/albums/${albumId}`, {
        method: 'DELETE',
        })
        .then((response) => {
            if (response.status === 200) {

                // If the DELETE request is successful (simulated), remove the album from the state
                setAlbums((prevAlbums) => prevAlbums.filter((album) => album.id !== albumId));
            } else {

                // Handle the error or display a message if the deletion fails
                console.error('Failed to delete album');
            }
        });
    };
    

    return (
        <div>
            {/* Header & Input Field*/}
            <h1> <img src="https://cdn-icons-png.flaticon.com/128/1187/1187525.png" alt="logo"/>Album Manager</h1>
            <input
                type="text"
                placeholder="New Album Title"
                value={newAlbumTitle}
                onChange={(e) => setNewAlbumTitle(e.target.value)}
            />
            <button onClick={addAlbum}>Add Album</button>

            <br/>
            <br/>

            {/* Album Items */}
            <ul>
                {albums.map((album) => (
                <li key={album.id}>
                    {album.id === selectedAlbumId ? (
                    <input
                        type="text"
                        value={newAlbumTitle}
                        onChange={(e) => setNewAlbumTitle(e.target.value)}
                    />
                    ) : (
                    album.title
                    )}
                    <span>
                    {album.id === selectedAlbumId && isEditing ? (
                        <div>
                        <button onClick={updateAlbum}>Save</button>
                        <button onClick={() => toggleEdit(null)}>Cancel</button>
                        </div>
                    ) : (
                        <button onClick={() => toggleEdit(album.id)}>Edit</button>
                    )}
                    <button onClick={() => deleteAlbum(album.id)}>Delete</button>
                    </span>
                </li>
                ))}
            </ul>
        </div>
    ); 
}

export default AlbumManager;
