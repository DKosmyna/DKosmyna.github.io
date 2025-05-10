import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
    'https://vrmiietkfzhpfgrdzfch.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybWlpZXRrZnpocGZncmR6ZmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTY3MDEsImV4cCI6MjA1OTc3MjcwMX0.JSmpMmb4EBmKOEfr_Xl-fg7EyFmliC3aF-MhreNsW8E'
  )

const container = document.getElementById('latest-posts')

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('uk-UA', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

function createPostHTML(post) {
  return `
    <div class="col-md-6 related-post-col">
      <div class="post-item-cover">
        <div class="post-header">
          <div class="related-post-categ">${post.category}</div>
          <div class="post-thumbnail">
            <a href="single-blog.html?id=${post.id}">
            <img class="rx-lazy" src="${post.cover_image || 'assets/img/placeholder-all.png'}" alt="img">
            </a>
          </div>
        </div>
        <div class="post-content">
          <div class="meta">
            <span class="post-date"><i class="fa fa-calendar" aria-hidden="true"></i>${formatDate(post.created_at)}</span>
          </div>
          <h3 class="title"><a href="single-blog.html?id=${post.id}">${post.title}</a></h3>
          <div class="text">
            <p>${post.excerpt || ''}</p>
          </div>
        </div>
        <div class="post-footer">
          <div class="meta">
            <span class="post-by"><i class="fa fa-user" aria-hidden="true"></i><a href="#">${post.author || 'Адміністратор'}</a></span>
            <span class="post-comment"><i class="fa fa-comment" aria-hidden="true"></i><a href="#">0 Comments</a></span>
          </div>
          <a href="single-blog.html?slug=${post.slug}" class="btn"><span>читати →</span></a>
        </div>
      </div>
    </div>
  `
}

async function loadPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(4)

  if (error) {
    container.innerHTML = `<p>Помилка: ${error.message}</p>`
    return
  }

  container.innerHTML = data.map(createPostHTML).join('')
}

document.addEventListener('DOMContentLoaded', loadPosts)