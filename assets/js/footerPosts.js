import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabase = createClient(
    'https://vrmiietkfzhpfgrdzfch.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybWlpZXRrZnpocGZncmR6ZmNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxOTY3MDEsImV4cCI6MjA1OTc3MjcwMX0.JSmpMmb4EBmKOEfr_Xl-fg7EyFmliC3aF-MhreNsW8E'
  )

async function loadFooterBlogLinks() {

console.log('FOOTER')

  const container = document.getElementById('footer-blog-links')
  if (!container) return

  const { data, error } = await supabase
    .from('posts')
    .select('title, slug')
    .order('created_at', { ascending: false })
    .limit(4)

  if (error || !data) return

  container.innerHTML = data.map(post => `
    <li><a href="single-blog.html?slug=${post.slug}" title="${post.title}">${post.title}</a></li>
  `).join('')
}

loadFooterBlogLinks()