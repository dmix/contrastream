# contrastream

**Name**:   contrastream

**About**:  Next-gen static site generator

**Author**: Dan McGrady <dan@dmix.ca>

**Repo**:   https://github.com/dmix/contrastream

-------------------------------------------------

## Introduction

### What is contrastream?

Contrastream is a highly-specialized static site generator for creating
websites using a next-gen toolkit and a component-based architecture.

Ideal for creating:

- a product landing page for a start-up
- multi-page business website including a markdown-based blog
- open-source project website deployed on Github-pages

### Why create another static-site-generator?

For the specific usecases mentioned above I was dissatisfied with the current
mainstream options:

a) While Gulp/grunt-based systems offer plenty of flexibility, they also
require plenty of boilerplate, customization, and maintenance as a result.

    Most businesses just need to get shit done. As a result, having an
    opinionated and focused framework is almost always the better option than
    a catch-all tool.

    Our philosophy is that a site generator should be invisible as
    possible during the web design process, allowing users to focus on
    what matters (writing content, design, etc).

b) Lack of component-based systems for traditional websites

    React/Polymer are nice but are for an entirely different use-case. I
    wanted a simple system where (for example) I could create a navigation
    component then open a css/js/templates/etc file and call:
        > import component/navigation.{css|js|html}
    some projects such as Duo.js/components/bower/etc have accomplished
    this but seem to be again focused on dynamic web apps.

c) The recent development of PostCSS, ES6/7, and web-components make this an
   ideal time to rethink how we build traditional websites.

    Web apps has seen a radical depature from traditional practices
    recently with React/Angular/etc.

    Contrastream is a similar depature - but focused on traditional
    static sites. An experiment in shifting away from rigid monolithic
    websites towards a system that fully embraces atomic architecture,
    reusability, concurrency, and seperation of concerns.

### How is contrastream different?

1. Focused entirely on a specific use-case: Building a static website for a
   business, product, or project.

2. Isolation of concerns
    - Sites are broken up into a) components, b) themes, and c) content
    - Keep your design, interactive elements, and content separate
    - A (simple) modular architecture improves maintainability
    - Iterate on isolated components without touching the larger site

3. Next-gen toolkit
    - Stylesheets = CSS4 via CSSnext
    - Javascript = ES6/7 via Babel.js
    - HTML = Nunjucks templating

4. Component-based design
    - Leveraging native import features of CSS4, ES6, & nunjucks
    - Without the baggage of using React/Polymer or
    - Not limited to just CSS/JS as are Duo/bower/etc
    - Reuse components across different websites or publish them on Github

5. Highly-optimized output
    - Minified and compressed
    - Generates production-ready files
    - Utilizing gzip, htmlmin, imagemin, CSSNano, and uglify.js
    - Rebuilds source files quickly and incrementally
    - Optimizers can be disabled during development


## Usage

### Project structure

A project consists of the following directories:

./components/ = Larger websites are broken up into small reusuable components
                each composed of .JS, .CSS, and .HTML files which can be
                imported elsewhere by any other file of the same type.

                Example components: nav, footer, search_box, contact_form.

./themes/     = Contains your website's design. Composed of layouts,
                page templates, and stylesheets/JS.

                Example themes: corporate, blog, docs, survey.

./content/    = Markdown/TOML files containing the content which gets
                injected into theme templates.

                Example content: homepage copywriting, blog posts, docs.


## Development

### Current Status

Currently in heavy development. Not recommended for production usage.

#### Milestones

- Oct 2015 - Prototype v1
    - Single-script
    - Concurrency using Golang-style co-routines (co)
    - Experimenting with components/vendoring
    - Functional composition using Ramda
    - Benchmarking with taim
    - CSSNext / Babel / TOML processing
    - Watch script using Chokidar

- Nov 2015 - Prototype v2
    - Fly-based build script
    - Pros:
        - easy way to use ES7 async/await-style concurrency
        - built-in watch, clean, glob, benchmarking utilities
        - ideal for simple gulp-style scripts
    - Cons:
        - written before ES7 so does not (fully) taking advantage of ES7 async/await and will probably needs a rewrite for ES7
        - the rigid structure and limited featureset make it not well suited for complex builds

- Present - Alpha
    - Custom build script
    - Testing using mocha
    - State and config managed using an immutable radix tree (Baobab)
    - Components system  = working
    - Templates, CSS, JS = building
    - Theme system = early stages

### TODO

- Metadata processor (TOML)
- Markdown processor
- Better theme support
- Optimizers/minifiers
- Automated building (currently hardcoding which files to build)

### Future

- Node version
    - Better file watching (caching mtime?)
    - Caching and incremental builds
    - Benchmarking
    - Concurrency/async
    - HTTP server
    - Better error handling
    - SASS/LESS support?

- New content file concept:
    - A new format for composing pages
        - For ex: homepage.content
    - containing markdown, toml, and html
        - import components (html/js/css)
    - nunjucks extension/fork?
    - vim/sublime/atom syntax highlighting

- Erlang rewrite?
    - core powered by erlang (spawning processors, managing state)
    - processors can be any language (node, go, etc)
    - hot loading components
    - failure resiliant
    - use Cowboy as HTTP server
    - powers site in production (support hot loading)

- Go HTTP server?
