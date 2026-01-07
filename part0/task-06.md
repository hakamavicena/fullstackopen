sequenceDiagram
    participant browser
    participant server

    browser->>server: POST 
    https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server->>browser: Redirect to perform a new HTTP GET Request to the https://studies.cs.helsinki.fi/exampleapp/notes
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the new notes  JSON from the server triggered by the clicked button
