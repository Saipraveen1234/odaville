document.addEventListener("DOMContentLoaded", function() {
    // Initialize TinyMCE
    if (typeof tinymce !== 'undefined') {
        tinymce.init({
            selector: '#blog-content',
            height: 400,
            menubar: false,
            plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | formatselect | ' +
                'bold italic backcolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | help',
            content_style: 'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 14px }',
            setup: function(editor) {
                editor.on('change', function() {
                    editor.save(); // This syncs TinyMCE content with textarea
                });
            }
        });
    }

    const blogForm = document.getElementById("blog-post-form");
    const contentTextarea = document.getElementById("blog-content");
    
    if (blogForm && contentTextarea) {
        let isSubmitting = false; // Add flag to prevent double submission
        
        blogForm.addEventListener("submit", async function(e) {
            e.preventDefault();
            
            // Prevent double submission
            if (isSubmitting) return;
            isSubmitting = true;
            
            // Ensure TinyMCE content is synced
            if (typeof tinymce !== 'undefined' && tinymce.get('blog-content')) {
                tinymce.get('blog-content').save();
            }
            
            // Create FormData
            const formData = new FormData(blogForm);
            
            // Get blog ID and status
            const blogId = document.getElementById("blog-id").value;
            const status = document.getElementById("blog-status").value;
            
            // Update the isPublished value based on the status dropdown
            formData.set("isPublished", status === "published");
            
            // Prepare API request
            let url = `http://localhost:5000/api/blog`;
            let method = "POST";
            
            if (blogId) {
                url = `http://localhost:5000/api/blog/${blogId}`;
                method = "PUT";
            }
            
            // Show saving indicator
            const saveBtn = blogForm.querySelector(".save-btn");
            const originalBtnText = saveBtn.textContent;
            saveBtn.textContent = "Saving...";
            saveBtn.disabled = true;
            
            try {
                // Send the API request
                const response = await fetch(url, {
                    method: method,
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Server responded with status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Blog saved successfully:", data);
                
                saveBtn.textContent = "Saved!";
                setTimeout(() => {
                    saveBtn.textContent = originalBtnText;
                    saveBtn.disabled = false;
                    
                    // Reset form and TinyMCE
                    if (typeof tinymce !== 'undefined' && tinymce.get('blog-content')) {
                        tinymce.get('blog-content').setContent('');
                    }
                    blogForm.reset();
                    
                    // Reload blog posts if functions exist
                    if (typeof loadBlogPosts === 'function') loadBlogPosts();
                    if (typeof initDashboard === 'function') initDashboard();
                    
                    alert(blogId ? "Blog post updated successfully!" : "Blog post created successfully!");
                }, 1500);
            } catch (error) {
                console.error("Error saving blog post:", error);
                saveBtn.textContent = originalBtnText;
                saveBtn.disabled = false;
                alert("Error saving blog post: " + error.message);
            } finally {
                isSubmitting = false; // Reset submission flag
            }
        });
    }
});