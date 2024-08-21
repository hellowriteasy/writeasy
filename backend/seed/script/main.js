const openaiTokenCounter = require("openai-gpt-token-counter");
const model = "gpt-3.5-turbo"; // Replace with the OpenAI model you want to use

let text =
  `The Impact of Technology on Modern Society
Technology has been a cornerstone of human progress, reshaping societies across the globe in myriad ways. From the invention of the wheel to the rise of artificial intelligence (AI), technology has continuously altered how we live, work, and interact. This essay explores the multifaceted impact of technology on modern society, including its effects on communication, work, education, and social relationships, while also addressing the challenges and ethical considerations that accompany technological advancements.

Transforming Communication
One of the most profound ways technology has impacted modern society is through communication. The advent of the internet and mobile technology has revolutionized how people connect with one another. Social media platforms such as Facebook, Twitter, and Instagram have transformed personal and professional interactions, allowing individuals to maintain relationships over long distances and share their lives in real-time. This instant connectivity has democratized information dissemination, enabling grassroots movements and global awareness on a scale previously unimaginable.

However, this revolution in communication also brings challenges. The constant flow of information can lead to information overload, where individuals struggle to process and prioritize the vast amounts of content they encounter daily. Additionally, the prevalence of social media has raised concerns about privacy and mental health. Online interactions can sometimes lead to feelings of inadequacy and anxiety, particularly among younger users who are more susceptible to the pressures of curating a perfect online persona.

Redefining Work and Employment
Technology has also fundamentally changed the nature of work. Automation, driven by advancements in robotics and AI, has streamlined many repetitive tasks, leading to increased efficiency and productivity. For example, manufacturing industries have seen significant transformations with the introduction of automated assembly lines and robotic systems. Similarly, AI and machine learning algorithms are now capable of analyzing vast datasets to make predictions and optimize business processes.

While these technological innovations offer numerous benefits, they also pose challenges. The displacement of traditional jobs due to automation has sparked debates about the future of work. Many low-skilled and routine jobs are at risk of being replaced by machines, necessitating a shift in workforce skills and education. This transition can be particularly challenging for workers who may not have the resources or opportunities to retrain for new roles. Governments and organizations must address these issues by investing in education and training programs to support workers in adapting to the evolving job market.

Revolutionizing Education
In the realm of education, technology has introduced new ways of learning and teaching. Online learning platforms, such as Coursera and Khan Academy, offer access to educational resources and courses from around the world. These platforms have made it possible for learners to acquire new skills and knowledge at their own pace, breaking down geographical and financial barriers to education.

Moreover, educational technologies like interactive whiteboards, virtual reality (VR), and artificial intelligence have enriched the learning experience. VR can simulate immersive environments for subjects like history and science, while AI-driven tools provide personalized learning experiences tailored to individual student needs.

Despite these advancements, there are concerns about the digital divide, which refers to the gap between those who have access to technology and those who do not. This divide can exacerbate existing inequalities, as students without access to digital tools may fall behind their peers. Addressing this issue requires concerted efforts to ensure equitable access to technology and resources in educational settings.

Impacting Social Relationships
Technology has also influenced social relationships and family dynamics. Video conferencing tools, such as Zoom and Skype, have made it easier for people to maintain connections with family and friends despite physical distance. Virtual gatherings and online communities provide spaces for people to connect over shared interests and experiences.

However, the increased reliance on digital communication can sometimes undermine face-to-face interactions. The nuances of nonverbal communication, such as body language and tone of voice, are often lost in digital exchanges, potentially leading to misunderstandings and weakened personal connections. Additionally, the pervasive presence of technology in daily life can lead to issues of overuse and distraction, affecting the quality of interpersonal relationships and family time.

Addressing Ethical Considerations
As technology continues to advance, ethical considerations become increasingly important. Issues such as data privacy, cybersecurity, and the ethical use of AI are at the forefront of technological discussions. The collection and analysis of personal data by tech companies raise concerns about privacy and the potential misuse of information. Ensuring that data is handled responsibly and transparently is crucial for maintaining public trust.

Furthermore, the development of AI and machine learning algorithms raises ethical questions about bias and fairness. AI systems can inadvertently perpetuate existing biases if they are trained on skewed datasets. Addressing these biases requires ongoing efforts to develop and implement ethical guidelines and standards for AI development and deployment.

Conclusion
Technology has undeniably transformed modern society, offering numerous benefits and opportunities while also presenting challenges and ethical dilemmas. From revolutionizing communication and work to reshaping education and social relationships`;

const tokenCount = openaiTokenCounter.text(text, model);
const characterCount = text.length; // Calculate the number of characters


console.log(`words: ${text.split(" ").length}`);
console.log(`tokens: ${tokenCount}`);
