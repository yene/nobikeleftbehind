<template>
  <header class="navbar">
    <a href="/">
      <img src="/favicon-32x32.png" style="vertical-align:middle; margin-top: -6px; margin-right:7px;"><span class="site-name">No Bike Left Behind</span>
    </a>
    <div class="links">
      <nav class="nav-links">
        <div class="nav-item"><a href="/guide/" class="nav-link"></a></div>
        <div class="nav-item">
          <a href="https://makezurich.ch/box/3/" target="_blank" rel="noopener noreferrer" class="repo-link">
            Challenge
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg>
          </a>
        </div>
          <div class="nav-item">
          <a href="https://github.com/yene/nobikeleftbehind" target="_blank" rel="noopener noreferrer" class="repo-link">
            GitHub
            <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" x="0px" y="0px" viewBox="0 0 100 100" width="15" height="15" class="icon outbound"><path fill="currentColor" d="M18.8,85.1h56l0,0c2.2,0,4-1.8,4-4v-32h-8v28h-48v-48h28v-8h-32l0,0c-2.2,0-4,1.8-4,4v56C14.8,83.3,16.6,85.1,18.8,85.1z"></path><polygon fill="currentColor" points="45.7,48.7 51.3,54.3 77.2,28.5 77.2,37.2 85.2,37.2 85.2,14.9 62.8,14.9 62.8,22.9 71.5,22.9"></polygon></svg>
          </a>
        </div>
      </nav>
    </div>
  </header>
</template>

<script>
export default {
  name: 'SiteHeader',
}
</script>

<style lang="scss">

.nav-links a {
  line-height: 1.4rem;
  color: inherit;
}

.navbar a, .navbar img, .navbar span {
  display: inline-block;
}

.nav-item>a:not(.external).router-link-active, .nav-item>a:not(.external):hover {
    margin-bottom: -2px;
    border-bottom: 2px solid #0071bb;
}

.navbar {
  //position: fixed;
  //top: 0;
  //left: 0;

  z-index: 20;
  right: 0;
  height: 3.6rem;
  background-color: #fff;
  box-sizing: border-box;
  border-bottom: 1px solid #eaecef;
  margin-bottom: 1px;

  padding: .7rem 1.5rem;
  line-height: 2.2rem;
}

.navbar .links {
  font-size: .9rem;
  position: absolute;
  right: 1.5rem;
  top: .7rem;
}

.nav-links .nav-item {
  cursor: pointer;
  position: relative;
  display: inline-block;
  margin-left: 1.5rem;
  line-height: 2rem;
}

.nav-links {
  display: inline-block;
}

.navbar span {
  display: inline-block;
}

.navbar .site-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
  position: relative;
}
</style>
