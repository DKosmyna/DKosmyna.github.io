import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  'https://vrmiietkfzhpfgrdzfch.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybWlpZXRrZnpocGZncmR6ZmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTY3MDEsImV4cCI6MjA1OTc3MjcwMX0.JSmpMmb4EBmKOEfr_Xl-fg7EyFmliC3aF-MhreNsW8E'
)

const container = document.querySelector('.blog-cover')
const filtersContainer = document.createElement('div')
filtersContainer.className = 'blog-filters'
filtersContainer.style.textAlign = 'center'
filtersContainer.style.marginBottom = '40px'
container.before(filtersContainer)

let allPosts = []

if (!window.location.pathname.includes('single-blog.html')) {
  loadPosts()
}

async function loadPosts() {
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    container.innerHTML = `<p>Помилка завантаження статей: ${error.message}</p>`
    return
  }

  allPosts = posts
  const categories = getUniqueCategories(posts)
  renderFilterButtons(categories)
  renderPosts('all')
}

function getUniqueCategories(posts) {
  const set = new Set(posts.map(p => p.category?.trim()).filter(Boolean))
  return Array.from(set).sort()
}

function renderFilterButtons(categories) {
  filtersContainer.innerHTML = ''

  const allBtn = document.createElement('button')
  allBtn.textContent = 'Усі статті'
  allBtn.className = 'btn filter-btn active'
  allBtn.dataset.category = 'all'
  filtersContainer.appendChild(allBtn)

  categories.forEach(category => {
    const btn = document.createElement('button')
    btn.textContent = category
    btn.className = 'btn filter-btn'
    btn.dataset.category = category
    filtersContainer.appendChild(btn)
  })


  filtersContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filtersContainer.querySelector('.active')?.classList.remove('active')
      btn.classList.add('active')
      renderPosts(btn.dataset.category)
    })
  })
}

let currentPage = 1
const postsPerPage = 5

function renderPosts(category, page = 1) {
  currentPage = page
  container.innerHTML = ''

  const filtered = category === 'all'
    ? allPosts
    : allPosts.filter(post => post.category?.trim() === category)

  if (filtered.length === 0) {
    container.innerHTML = '<p>Немає статей у цій категорії</p>'
    updatePagination(0)
    return
  }

  const start = (page - 1) * postsPerPage
  const end = start + postsPerPage
  const paginated = filtered.slice(start, end)

  paginated.forEach(post => {
    const item = document.createElement('div')
    item.className = 'post-item-cover'
    item.innerHTML = `
      <div class="post-header">
        <div class="post-thumbnail">
          <a href="single-blog.html?slug=${post.slug}">
            <img src="${post.cover_image}" alt="img">
          </a>
        </div>
      </div>
      <div class="post-content">
        <div class="meta">
          <span class="post-by"><i class="fa fa-user"></i> ${post.author || 'Admin'}</span>
          <span class="post-date"><i class="fa fa-calendar"></i> ${new Date(post.created_at).toLocaleDateString()}</span>
          <span class="post-category"><i class="fa fa-tag"></i> ${post.category || 'Без категорії'}</span>
        </div>
        <h2 class="title"><a href="single-blog.html?slug=${post.slug}">${post.title}</a></h2>
        <div class="text">
          <p>${post.content.slice(0, 180)}...</p>
        </div>
      </div>
      <div class="post-footer">
        <a href="single-blog.html?slug=${post.slug}" class="btn"><span>Прочитати</span></a>
      </div>
    `
    container.appendChild(item)
  })

  updatePagination(Math.ceil(filtered.length / postsPerPage), category)
}

function updatePagination(totalPages, category = 'all') {
  const pagination = document.querySelector('.pagination')
  if (!pagination) return

  pagination.innerHTML = ''

  const addPage = (label, page, isActive = false) => {
    const li = document.createElement('li')
    li.className = `pagination-item${isActive ? ' active' : ''}`
    li.innerHTML = `<a href="#">${label}</a>`
    li.addEventListener('click', (e) => {
      e.preventDefault()
      renderPosts(category, page)
    })
    pagination.appendChild(li)
  }

  if (totalPages <= 1) return


  if (currentPage > 1) {
    addPage('<i class="fa fa-angle-left"></i>', currentPage - 1)
  }

  for (let i = 1; i <= totalPages; i++) {
    addPage(i, i, i === currentPage)
  }


  if (currentPage < totalPages) {
    addPage('<i class="fa fa-angle-right"></i>', currentPage + 1)
  }
}



const isSingleBlog = window.location.pathname.includes('single-blog.html')

if (isSingleBlog) {
  const params = new URLSearchParams(window.location.search)
  const slug = params.get('slug')

  if (!slug) {
    container.innerHTML = '<p>Стаття не знайдена.</p>'
  } else {
    renderSingleArticle(slug)
  }
}

async function renderSingleArticle(slug) {
  const { data: posts } = await supabase.from('posts').select('*').order('created_at', { ascending: false })
  allPosts = posts

  const post = posts.find(p => p.slug === slug)

  if (!post) {
    container.innerHTML = '<p>Стаття не знайдена.</p>'
    return
  }


  document.querySelector('h1.title').textContent = post.title


  const breadcrumb = document.querySelector('.breadcrambs')
  const li = document.createElement('li')
  const shortTitle = post.title.length > 10 ? post.title.slice(0, 10) + '...' : post.title
  li.textContent = shortTitle
  breadcrumb.appendChild(li)


  const postHtml = `
    <div class="post-item-cover">
      <div class="post-header">
        <div class="post-thumbnail">
          <img src="${post.cover_image}" alt="${post.title}">
        </div>
      </div>
      <div class="post-content">
        <div class="meta">
          <span class="post-by"><i class="fa fa-user"></i> ${post.author}</span>
          <span class="post-date"><i class="fa fa-calendar"></i> ${new Date(post.created_at).toLocaleDateString()}</span>
          <span class="post-category"><i class="fa fa-tag"></i> ${post.category}</span>
        </div>
        <div class="article-text">
          ${post.content}
        </div>
      </div>
    </div>
  `
  container.insertAdjacentHTML('afterbegin', postHtml)

  renderPrevNext(posts, post)
  renderRelated(posts, post)
}

function renderPrevNext(posts, currentPost) {
  const nav = document.querySelector('.navigation')
  if (!nav) return

  const index = posts.findIndex(p => p.id === currentPost.id)
  const prev = posts[index - 1]
  const next = posts[index + 1]

  const prevEl = nav.querySelector('.navigation-left')
  const nextEl = nav.querySelector('.navigation-right')

  if (prev) {
    prevEl.href = `single-blog.html?slug=${prev.slug}`
    prevEl.querySelector('.title').textContent = prev.title
  } else {
    prevEl.style.display = 'none'
  }

  if (next) {
    nextEl.href = `single-blog.html?slug=${next.slug}`
    nextEl.querySelector('.title').textContent = next.title
  } else {
    nextEl.style.display = 'none'
  }
}

function renderRelated(posts, currentPost) {
  const relatedWrapper = document.querySelector('.s-related-posts .row')
  if (!relatedWrapper) return

  relatedWrapper.innerHTML = ''

  const related = posts.filter(p =>
    p.category === currentPost.category &&
    p.slug !== currentPost.slug
  ).slice(0, 4)

  related.forEach(post => {
    const col = document.createElement('div')
    col.className = 'col-md-6 related-post-col'

    col.innerHTML = `
      <div class="post-item-cover">
        <div class="post-header">
          <div class="related-post-categ">${post.category}</div>
          <div class="post-thumbnail">
            <a href="single-blog.html?slug=${post.slug}"><img src="${post.cover_image}" alt="${post.title}"></a>
          </div>
        </div>
        <div class="post-content">
          <div class="meta">
            <span class="post-date"><i class="fa fa-calendar"></i> ${new Date(post.created_at).toLocaleDateString()}</span>
          </div>
          <h3 class="title"><a href="single-blog.html?slug=${post.slug}">${post.title}</a></h3>
          <div class="text">${post.content.slice(0, 100)}...</div>
        </div>
        <div class="post-footer">
          <div class="meta">
            <span class="post-by"><i class="fa fa-user"></i><a href="#">${post.author}</a></span>
          </div>
          <a href="single-blog.html?slug=${post.slug}" class="btn"><span>Прочитати</span></a>
        </div>
      </div>
    `
    relatedWrapper.appendChild(col)
  })
}