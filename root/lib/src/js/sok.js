/**
 * SSG Website - Search Functionality (sok.js)
 * Re-implemented to support robust Google Reverse Image Search
 */

document.addEventListener('DOMContentLoaded', () => {
    // Configuration - Update these IDs to match your HTML exactly
    const config = {
        textInputId: 'search-bar',      // The main text input field
        imageInputId: 'imageInput',     // The file upload input (often hidden)
        buttonId: 'search-btn'          // The magnifying glass/search button
    };

    const textInput = document.getElementById(config.textInputId);
    const imageInput = document.getElementById(config.imageInputId);
    const searchBtn = document.getElementById(config.buttonId);

    // Safety check
    if (!searchBtn) {
        console.warn('Search button not found. Check IDs in sok.js');
        return;
    }

    // Main Search Function
    function performSearch() {
        // 1. Check for Image Search First
        if (imageInput && imageInput.files && imageInput.files.length > 0) {
            handleImageSearch(imageInput);
        } 
        // 2. Fallback to Text Search
        else if (textInput && textInput.value.trim() !== "") {
            const query = textInput.value.trim();
            // Redirect to Google Text Search
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        }
    }

    // Helper: Handle Google Reverse Image Search (The tricky part)
    function handleImageSearch(fileInputElement) {
        // To send a file to Google, we must use a POST form submission with multipart/form-data.
        // We cannot use fetch() due to CORS policies on Google's endpoint.
        // Solution: Create a dynamic form, move the input into it, submit, and restore.

        const originalParent = fileInputElement.parentNode;
        const nextSibling = fileInputElement.nextSibling; // To restore position exactly

        // Create the form that Google expects
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://www.google.com/searchbyimage/upload';
        form.enctype = 'multipart/form-data';
        form.target = '_blank'; // Open in new tab so user doesn't lose your site

        // Google requires the file input name to be "encoded_image"
        // We temporarily change the name of your input
        const originalName = fileInputElement.name;
        fileInputElement.name = 'encoded_image';

        // Move the file input into the form
        form.appendChild(fileInputElement);
        document.body.appendChild(form);

        // Submit the form
        form.submit();

        // Cleanup: Move input back and reset
        // We use a small timeout to ensure the submit event fires before we move the DOM node back
        setTimeout(() => {
            if (nextSibling) {
                originalParent.insertBefore(fileInputElement, nextSibling);
            } else {
                originalParent.appendChild(fileInputElement);
            }
            
            fileInputElement.name = originalName; // Restore original name
            fileInputElement.value = ''; // Clear the file so standard search works next time
            document.body.removeChild(form);
        }, 100);
    }

    // Attach Click Event
    searchBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default form submission if inside a form
        performSearch();
    });

    // Attach Enter Key Support (for text input)
    if (textInput) {
        textInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
});
