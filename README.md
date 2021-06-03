<p align="center"><img width="120" src="https://raw.githubusercontent.com/ns221102/farmy/master/farmy.png" alt="Farmy logo"></p>

<h1 align="center">Farmy</h1>

<p align="center">Powerful, modern and fast web framework</p>

<h2>Installation</h2>

```
$ npm i farmy
```

<h2>Example Usage</h2>

```
import {$, Component, View, State, Router} from 'farmy';

const ArticleView = new View(`

<article>
	<h1>[title]</h1>
	<p>[body]</p>
</article>

`);

ArticleView
	.catch('title',
		(value) => {
			return value.toUpperCase();
		})
	.catch('body',
		(value) => {
			return value + '...'
		});

class Article extends Component {
	
	constructor({title, body}) {
		super();
		this.title = title;
		this.body = body;
	}
	
	view() {
		return ArticleView.get({
			title: this.title,
			body: this.body
		});
	}
	
	load() {
		console.log('Article is loaded : ' + this.title);
	}
	
}

const ArticleState = new State();

ArticleState.init('articles', []);
ArticleState.catch('newArticle', (title, body) => {
	ArticleState.articles.push({
		title,
		body
	});
});


ArticleState.fire('newArticle', 'Farmy', 'Powerful, modern and fast web framework');
ArticleState.fire('newArticle', 'Features', '$, Component, View, State, Route');

const $root = $('#root');

const app = new Router();

app.use(() => {
	$root
		.clear()
		.renderClear();
});

app.path('/', () => {
	$root.innerHTML('<h1>Home Page</h1>');
});

app.path('/articles', () => {
	$root.renderAdd(
		new Article(ArticleState.articles[0]),
		new Article(ArticleState.articles[1])
	);
});

app.path('/articles/:n', ({params}) => {
	
	const n = params.n - 1;
	
	if (n >= ArticleState.articles.length) {
		Router.to('/articles');
		return;
	}
	
	$root.renderAdd(
		new Article(ArticleState.articles[n]),
	);
});

Router.after(() => {
	$root.render();
});

Router.start(app);
```