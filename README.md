# Boundless - A learning engine

Boundless is kind of like a wikipedia page for any topic you want, only more visual. Don't know what that looks like? Watch this video:

[![Boundless Demo Video](https://img.youtube.com/vi/zDD1lGYVsw0/0.jpg)](https://www.youtube.com/watch?v=zDD1lGYVsw0)

Thank you to everyone who has used Boundless! I got over 1.8k queries in 2 weeks, but it cost way more money than I expected. Now, I have limited the number of total queries to 50 per month. [Boundless](https://boundless-engine.vercel.app) will act as a demo for now.

Here are also some screenshots of boundless at work:

![Screenshot 1](./public/Screenshot%202024-06-04%20at%2022.25.46.png)

![Screenshot 2](./public/Screenshot%202024-06-05%20at%2022.21.37.png)

![Screenshot 3](./public/Screenshot%202024-06-04%20at%2022.26.06.png)

# How does it work?

The code is in this repository so here is how Boundless works on a high level:

I take in a query from the user, and all past queries that they want to be included within the context of the search. I pass this to multiple LLMs (GPT-3.5 and GPT-4o) who both have tailored prompts and get back a table of contents and a summary of the concept. All further summaries and searches are generated using the same LLMs. I process these reponses and dynamically render the divs and concepts.

Images and sources are fetched by an awesome API called Tavilly AI, which is more for RAG and LLMs, but serves its purpose for me here fine. However, it is pretty expensive after a certain amount of usage, so an extention to this project would be to try and build my own version of it using the google custom search API.


# Why did I build this

Over the summer, I have been using LLMs to help me get get a table of concepts for stuff I want to learn in different areas of machine learning. I thought this was pretty powerful, but these systems didn't provide you a way to learn more about the concept on the internet. Sometimes, the concepts were pretty abstract so an image would've helped too. 

I thought this combination would be pretty powerful if brought to life which is why I made Boundless.



