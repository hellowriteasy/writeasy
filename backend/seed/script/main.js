const Contest = require("../../src/models/contest");

require("dotenv").config();

const { connectDB } = require("../../config/db");
const Subscription = require("../../src/models/subscription");
const User = require("../../src/models/user");
const Story = require("../../src/models/story");
const GptService = require("../../src/services/gptService");
const gptService = new GptService(process.env.GPT_API_KEY); // Initialize GPT service
const bcrypt = require("bcryptjs");
const stripe = require("../../config/stripe");
const axios = require("axios");
const getTopPercentage = (array, percentage) => {
  // Sort the array by score in descending order
  const sortedArray = array.sort((a, b) => b.score - a.score);

  // Calculate the number of items to include (20% of the array)
  const topCount = Math.ceil((percentage / 100) * sortedArray.length);

  // Return the top percentage of items
  return sortedArray.slice(0, topCount);
};

let stories = [
  {
    _id: "lilylc009@gmail.com",
    content: `Pride and Prejudice: Book vs. Film - A Tale of Two Mediums
Jane Austen's "Pride and Prejudice" is one of the most beloved novels in English literature. Published in 1813, this classic tale of love, class, and social expectations has been adapted into numerous films and television series. While both the book and its film adaptations tell the same basic story, the experiences they offer can be surprisingly different. Let's explore how the written word compares to its cinematic renditions.
The Novel: Depth in Every Page
Austen's novel is a masterful exploration of the social fabric of early 19th century England. Through the eyes of Elizabeth Bennet, the second of five sisters, readers are drawn into a world where marriage and social standing are of utmost importance. The novel's strength lies in its rich character development and the subtle irony that Austen weaves throughout her prose. Each character, from the proud Mr. Darcy to the meddlesome Mrs. Bennet, is given depth and nuance. The narrative voice, often tinged with wit and sarcasm, invites readers to reflect on the absurdities of societal norms.
In the novel, the development of Elizabeth and Darcy's relationship is gradual and intricate. Their initial misunderstandings and prejudices give way to mutual respect and affection, revealing how first impressions can be misleading. Austen carefully constructs this transformation, providing readers with insight into both characters' inner thoughts and feelings. This depth of character is a hallmark of the novel and something that fans often find missing in film adaptations.
The Film: A Visual and Emotional Journey
Film adaptations of "Pride and Prejudice" vary greatly, but they all share the challenge of condensing a 124 713-word, 432-page novel into a few hours of screen time. The most acclaimed adaptations, such as the 1995 BBC miniseries starring Colin Firth and Jennifer Ehle and the 2005 film featuring Keira Knightley and Matthew Macfadyen, each bring their unique interpretation to Austen's work.
One of the key differences between the book and its adaptations is the portrayal of characters. In the film, the visual medium allows for a more immediate emotional connection. For instance, the chemistry between the lead actors can convey the tension and eventual affection between Elizabeth and Darcy without the need for extensive dialogue. However, this also means that some of the subtler aspects of Austen's characterisations and themes may be lost or simplified.
Additionally, the setting and costumes in films play a crucial role in bringing the period to life, something that words alone cannot fully capture. The sweeping English countryside, the grandiose estates, and the elegant attire all add to the viewer's immersion in the story. The visual appeal of these adaptations can make the social and class distinctions of the period more tangible and relatable to modern audiences.
Book vs. Film: Different, Yet Complementary
While the book offers a deeper dive into the characters and themes, the films provide a visual and emotional immediacy that can be equally compelling. For purists, the novel remains the definitive "Pride and Prejudice," offering all the intricate details of Austen's world. However, for those new to the story or seeking a quick immersion, the films provide a beautifully condensed version that captures the essence of the narrative.
In conclusion, both the book and its film adaptations have their unique strengths. They cater to different preferences and serve as complementary experiences rather than competitors. Whether you choose to read the novel or watch a film, you're engaging with a timeless story that continues to resonate across generations.`,
  },

  {
    _id: "edwardhx27@gmail.com",
    content: `Book Review of Skulduggery Pleasant (entire series)

When I had first heard of this series of books, I had just heard my uncle died. After his funeral and getting what he left me in his wills, I decided to see what this book was about. After all, he had encouraged me to read more often. So, I read the first book thinking it was going to be some book about creatures and evil. Well, this book was more; it was fascinating how Derek Landy, the author, uses such unoriginal ideas and turns into something I have never read about before. The detail that is focused on the main character is arguably one of the best I have read about, and the story line could go on forever. This was also relatable in a way to me, so I found it easier to understand the storyline and emotions of characters. I think that Skulduggery Pleasant as a series is has high potential and I think that this is a book most people don’t know. So, if you want something packed with action, humour and fun, this is your book.

The storyline. This storyline goes through 15 books so I will just give you some key points. Also, if you don’t like skeletons, don’t read this book because there is a character who is a skeleton. So, the book starts with the other main character (Yes there are 2 main characters) called Stephanie Edgley. Her uncle has died so, they go to the will reading ceremony. There, his uncle gives her his villa. When Stephanie gets there, she is attacked by a mysterious man that we don’t know. The other main chatacter saves her, and reveals magic and his bony head to her. I won’t say anymore about the series but if you want to you can read it for yourself and enjoy the humour and action Derek Landy puts into this wonderful series of books. 

Derek Landy is an Irish author born in 1974. He has written many books including Skulduggery Pleasant and the Demon Road trilogy. He has also started writing Marvel comics since 2018. Derek has written two movie scripts that have become IFTA award-winning Dead Bodies and IFTA-nominated Boy Eats Girl. Frustrated with making films, he moved on to the Skulduggery Pleasant series. The first book in the series got the Red House Children’s award in 2008 and Playing with Fire (n.o.2) , Mortal Coil (n.o.5) and Last Stand of Dead Men (n.o.8) each won the senior Irish Children’s book award, in 2009, 2010 and 2013.

Generally, this is a wonderful series with many good plot twists; the action and humour are both compelling and the series is just wonderful. This is a must read if you like action and/or humour. Honestly, Mr Landy deserves a lot of credit and I hope to see more books come out in this series. This book has been a delight to read and it is very under-rated as a series.`,
  },

  {
    _id: "lunuttall@yahoo.com",
    content: `Murder Most Unladylike is a nine set book series about Daisy Wells and Hazel Wong. One of my favourite being Death Sets Sail. Written by Robin Stevens, the set is about murders and crime cases everywhere they turn leaving people on cliff hangers better than most. DEATH SETS SAIL is a book about the two girls traveling on a cruise ship in Egypt, a woman gets stabbed and her sleepwalking daughter wakes up in blood. Therefore, the girls need to find out who did it it could not have been her daughter, who has her room locked every night and is scared to death about even looking at a police officer, or could it? That is one amazing book out of the rest which are amazing as well. 

The books are a good length as well at around 400 - 500 pages enough to get immersed in the detail and mystery of the murder  Making me cry every now and then, the book made me have several different rollercoasters. My heart always stops when they reveal the actual murderer and starts beating again at the end , Robin Stevens never lets us put the book down. At this point, I do not know if the books are addictive or I am just book greedy. The book is so amazing I literally cannot describe how amazing it actually is so why don't you try it. Even though it is sad when you have finished the book series, trust me I get it, you will not regret this decision. I promise. Each book has its own individual story but with the same characters. It is similar to Sherlock Holmes. In fact, Daisy describes them as Watson and Sherlock. My favourite character by far is Hazel because she is the main character. The characters all have a range of background. the author describes everything that the characters see in so much detail, painting a vivid picture in my mind.

In short an excellent mystery series that exercised my imagination and  kept me gripped to the end.`,
  },

  {
    _id: "watermarginlondon@hotmail.co.uk",
    content: `Charles Dickens's A Christmas Carol, loved by all, stands as one of the most endearing stories during this wonderful X-mas season. To capture a powerful, nice virtuousness, this tale—nearly perfect and published nearly 200 years ago—did much more than secure Dickens' place at the helm as a literary 'king.'.

This great story was about Ebenezer Scrooge, a mean and selfish old figure who, by the name, WAS a penny-pinching BULLY until X-mas eve. His life was completely changed by his old partner Marley Jacob and 3 continuous spirits: Past, Present, and Future. It is through those awkward counters with the spirits that Scrooge is put in the face of consequences of his cruelty, instantly leading to his perfect and joyous figure ready for a great X-Mas!

The greatest thing that makes the Christmas Carol such a great novella is its social commentary. The auther, criticizing the inequality of his time period, does so by presenting his social responsibility. The theme still stands very topical nowadays, with the novella calling for everyone to reflect on their actions and consequences toward other people.

The Christmas Carol is thereby much more than a festive tale; it is also a timeless exploration into human nature and the spirits of X-mas. It is a classic novella, with heartfelt reminders from the author on the very important points of empathy and generosity.`,
  },

  {
    _id: "jianfang26@163.com",
    content: `"Rooftoppers" by Katherine Rundell is a delightful and whimsical novel that will captivate readers of all ages. The story follows the adventures of Sophie, a young girl who is determined to find her mother, despite everyone believing she died in a shipwreck when Sophie was just a baby. Young Sophie is headstrong and wouldn't take a no for an answer. So with the help of Charles, her guardian, they sailed to France, where they her mother was last seen.

The novel's setting in the rooftops of Paris adds a sense of magic and wonder to the story, as Sophie navigates the city with the help of her friend Matteo. The bond between Sophie and Matteo is beautifully portrayed, and their escapades on the rooftops are both thrilling and heartwarming. Matteo and his other rooftoppers friends lived on the roofs for a long time, so they were very experienced, unlike Sophie. But she was determined and a swift learner, and in a few days, she can leap off from one rooftop to another!

Rundell's prose is lyrical and evocative, bringing the city of Paris to life with vivid descriptions and a keen sense of atmosphere. The characters are endearing and well-developed, and readers will find themselves rooting for Sophie every step of the way.

"Rooftoppers" is a charming and enchanting novel that celebrates the power of friendship, the joy of discovery, and the resilience of the human spirit. I highly recommend it to anyone looking for a heartfelt and uplifting story.`,
  },

  {
    _id: "catannie@gmail.com",
    content: `I have decided to review the book Of Mice and Men by John Steinbeck.

The book is about two men named George and Lennie in California during the 1930s as they find work on a ranch, in a place called Soledad. However, Lennie has a neurodiverse condition which makes him have the countenance of a seven year old. Yet, he is incredibly strong and loves feeling soft things, which gets him into trouble before they arrive at the ranch and during their stay there. He also does not understand the nature of this world Eventually, through every situation, George manages to get him out - just barely. But will George be sly enough to get Lennie out of murder.. that is the greatest question.

I liked this book as it was engaging, thrilling and hooked me until the end. There was some great events and near moments in the book. However, most of the book was descriptions, and it was a slow moving story. If it had a bit more action it would be perfect for me.

I rate this book 4.5/5

In conclusion, this book was a very good novella with lots of gripping moments. I would recommend this if you like descriptive old-language short stories with not too much action. This novella also carries a message: of the dangers of believing in dreams, and how much you should value companionship.`,
  },

  {
    _id: "14548608@qq.com",
    content: `27th July 2024
Objective: Read “A Christmas Carol” by Charles Dickens (make sure it is the novel not the play version! and don’t worry it’s not very long!) and write a sophisticated, extended review of it. OR on any book/film that has affected you

The History Boys
The History Boys is a play that is filled with the excitement of the teenage years, puberty and all it entails.

The year is 1983, a rather contemporary audience is addressed, and the setting is an all-boys grammar school in Yorkshire. Bennet focuses on a class of 8 sixth-formers who stay on an extra term to study for Oxbridge exams as per tradition. The play is centered around them and no other students, the only other four main figures from the faculty being the Headmaster (here portrayed as the enemy of education by only caring about grades and funding), Mrs Lintott (a sensible yet confined to the traditional ways of teaching History), Hector (a homosexual, brilliant English master who went to Sheffield and detests exams but loves Literature) and finally Irwin (a Machiavellian figure who cares not about honesty but about achieving his aims-deceiving Oxbridge dons into accepting his students and later, deceiving the public into accepting a political bill).

The intriguing plot begins with Hector teaching the students in their general studies class which he deems ‘a waste of time’ and thinks that after the exams, their real education can resume. Hector firmly believes that making it into Oxbridge is unimportant and to be avoided, preferring instead Universities like Sheffield where he came from because there’s a whole world outside for them to explore. Things take a turn when Irwin comes in, at the request of the Headmaster, to raise the grades of the students and this works, a combination of the students’ talent and teaching, and all of them, even the dimmer Rudge, get into Oxford with flying colours. At the end of the play, Mrs Lintott, at Hector’s funeral (after the bike crash), asks everyone what they are doing. Most are doing prosperously but with not hints left of the literature love Hector tried to imbue into them, a few have fallen into the grip of drugs.

In conclusion, this play is a highly intriguing exploration made into the lives of teenagers, highly talented ones. Bennet breaks the illusion that Oxford and Cambridge, once having passed their exams, somehow magically make your adult life successful, and that is shown not to be the case. This play resonated with me because it showed me a path that I would eventually take, if I was lucky, and it showed me the outcome of all these exams and interviews. It has shown me something different from what we are taught in schools and is an invaluable insight into contemporary teaching. This is a play suitable for anyone above the age of 15 and is a treasure amongst plays representing education.`,
  },

  {
    _id: "ninapoint@hotmail.co.uk",
    content: `‘Holes’ is an inspiring novel by Louis Sachar is an astonishing book about the main protagonist Stanley Yelnats being sent to camp green lake, which doesn’t have a lake nor any green, a detention camp for bad children. Stanley was actually mistaken for the crime of stealing Clyde Livingston’s, a famous basketball player, shoe. Unlucky Stanley and the others 
that was also sent there had to dig a 5 foot whole every day, as the adults there thought that that’ll make them good children. But that’s not the case for the Warden. She wanted to dig up Kissin Kate Barlow’s, an infamous murderer from a long time ago, secret treasure. Later, Zero, one of the children from the camp that was nicknamed Zero because the others thought he was a empty shell that loves digging holes, and Stanley ran from the camp and walked towards the big thumb (a rock). 
Now there was a tale about Stanley’s no-good-dirty-rotten-pig-stealing-great-great-grandfather, Stanley’s grandfather wanted to marry a girl but another man said that he’ll give the girl’s father a fat pig, so Yelnats asked a old lady called Madame Zeroni for advice and she said to take a piglet of hers, and carry it up the mountain and make the piglet drink the lake’s water, while the piglet’s drinking to sing a tune that Madame Zeroni told him to sing. But on one condition, after he successfully married that girl he would carry Madame up the mountain and feed her the water, sing for her or he’ll be cursed. As been told, Yelnats does this every day and the piglet grew fatter and fatter, but on the day that the girl’s father decided who married her Yelnats forgot to carry the pig up the mountain so when the father weighed the pigs, they weighed exact same. Devastated Stanley’s great great grandfather leave the pig and went to boarding ship to America to start a new life, but he forgot to carry madame up the hill. Actually Zero’s real name was Hector Zeroni, and when Stanley Yelnats carried him up a mountain the curse was broken. 

It was commented thrilling by the Malorie Blackman, the one who created the heartwarming novel Pig Heart Boy. Its movie is also fire as it was released on the date of 24 October 2003 by the awesome Andrew Davis. It also features Tim Blake Nelson, who performed in numerous other films, as Pendaski. This book was the winner of the, National Book Awards in 1998. The movie has also won numerous awards including MTV 2004 and Young artist award 2004.  This is a book that everyone would agree to like, but it is okay to agree to disagree sometimes!
This novel will definitely make you immediately thrilled, excited and wishing to find out what happens next. It’s very fascinating as it has sold over 4.8 million copies worldwide! 
This book was definitely one of our favourites no doubt! This book has thought us a lot of things like never give up and determination as the two survives out in the wild with nothing to eat but onions and dirty water but comes back safe and sound. Please consider reading it.`,
  },

  {
    _id: "huihuinzz@gmail.com",
    content: `Objective: Read “A Christmas Carol” by Charles Dickens (make sure it is the novel not the play version! and don’t worry it’s not very long!) and write a sophisticated, extended review of it. OR on any book/film that has affected you  

His Dark Materials: Northen Lights is a book about a girl called Lyra Belacqua and her animal dæmon who live a carefree life among the scholars of Jordan College, Oxford. Her destiny takes her to the frozen lands of the Arctic, where witch-clans reign and ice-bears fight. And the extraordinary journey that awaits her will have immeasurable consequences far beyond her own world. This book is the first book of 3, which are: His Dark Materials: Northen Lights, His Dark Materials: The Subtle knife, and His Dark Materials: The Amber Spyglass. 

My favourite character is Serafina Pekkala, whom is clan queen of a witch-clan. She has helped Lyra numerous times and has a relationship with a certain helper of Lyra’s, whom she owes a debt, as this “helper” had saved her life a very long time ago. She has a calm demeanour and is around 300 years old.  However, the most notable and “real” character in my opinion was Lee Scoresby, a Texan aëronaut who has a sassy attitude, non-violent beliefs and consistent ethics. He also spouted my favourite quote: “Sticks and stones, I’ll break yer bones, but names ain’t worth a quarrel.” His personality and honesty stand out from all the other characters, making him one of a kind. Also, Philip Pullman’s use of imagery and description brings the story to life, which makes this book a page turner. I particularly like the description of the ice-bears' armour: “Every rivet was examined, every link tested, and the plates were burnished with the finest sand.” 

Unfortunately, there was an area of the book I disliked. This was when all the information was given, but there would still be confusion on whether a person was in trouble or not. Otherwise, I think this book is a proper masterpiece, with absolutely no flaws, except for the fact that the story ends. 

In general, this book is a mystical adventure, where people have dæmons (that are like half of their soul), Church fanatics who are obsessed with a mysterious thing falling from space called Dust, and a group of Gobblers. I would recommend this book for 7+ years of age, and people who like mystery and fantasy.  `,
  },

  {
    _id: "sis1267908@student.intsh.se",
    content: `“In the beginning, I wasn’t there. I don’t think the ancient Greeks were either.”
In a world where the ancient Greek gods are alive and kicking, the demigod son of Poseidon himself brings in his own twists and turns, let's not forget sarcastic comments, into the ancient Greek myths. Percy does not hold back. At all. “Why he didn't choose a better name for himself—like Deathbringer or José—I don't know, but it might explain why Ouranos was so cranky all the time.” From Hestia to Dionysus, Percy gives readers an insight into all twelve Olympians, plus two more not-so-Olympian gods. With his absolutely genius mind (cough cough), Percy brings the ancient Greek myths back to life in a funny, humorous book filled with blood, gore, and tons of sarcasm. So, I have the honour of presenting to you, a definite must-have on your bookshelf, Percy Jackson’s Greek Gods.`,
  },
  {
    _id: "ziyuwei@hotmail.com",
    content: `J.K. Rowling's Harry Potter series is a work of unparalleled storytelling, captivating readers of all ages with its intricately detailed and enchanting world of magic and wonder. The books exhibit Rowling's extraordinary talent for crafting complex plots and multifaceted characters, and exploring profound themes, keeping us wanting more. The magical universe creates an exceptional reading experience. 

The Harry Potter series is a captivating and thrilling adventure that expertly combines tension and action throughout the story. J.K. Rowling's masterful storytelling keeps readers on the edge of their seats as the characters navigate through a world of magic and mystery. The tension and heart-pounding action build-ups such as the thrilling Quidditch matches across all books, the daring escape from Gringotts bank in the seventh novel, and the intense battles against Death Eaters, create an immersive reading experience that leaves readers eager for more. Rowling's action in the novels adds a nice touch to Harry's adventures and these specific bits and examples showcase Rowling's ability to craft intense and gripping action scenes, making each book in the series a page-turner from start to finish, which is why I give the Harry Potter series a four and a half out of five.

The Harry Potter film series is also a successful and monumental achievement that brought J.K. Rowling's magical world to life on the big screen. Directed by several talented filmmakers, including Chris Columbus, Alfonso Cuarón, Mike Newell, and David Yates and produced by Warner Bros, the films allowed audiences to see Rowling's masterpiece on a visual screen. The film series became a cultural phenomenon, enchanting fans around the globe with its portrayal of the wizarding world.

The Harry Potter film series truly excels in capturing the wonder and magic of the original story. From the mesmerizing Hogwarts castle to Hogsmeade, Diagon Alley, the Forbidden Forest, and the Great Hall, the films showcase incredible visual effects, magical creatures, and spellbinding landscapes that make the wizarding world feel incredibly vibrant and immersive.

While the film adaptations of the Harry Potter series have their own merits, they necessarily condense and simplify the intricate narratives and character arcs found in the books. Although they do well in bringing the visual spectacle of the wizarding world to life, they cannot fully capture the depth and complexity of the storylines and characters. Certain subplots, backstories, and characters are cut to fit certain lengths for the film. In the Harry Potter books, many characters which play an important role are not included in the movie adaptations. For example, Peeves the mischievous poltergeist is a recurring character who adds comical chaos to Hogwarts in the books, but he is largely absent from the movies. Additionally, the character of Winky the house-elf and her subplot involving Hermoine's S.P.E.W. (Society for the Promotion of Elfish Welfare) is more extensively explored in the fourth and fifth books rather than in the film.

In conclusion, after carefully considering both J.K. Rowling's books and the film productions based on her work, I have come to a preference for her books. The depth of detail, character development, and intricacies of the magical world she creates are best experienced through her written words. While the films certainly offer a visual interpretation, the immersive experience of her storytelling truly shines through her written work. I award Rowling's novels and four and a half and the movies a four.
`,
  },
  {
    _id: "qi.jessie@gmail.com",
    content: `William Golding, a 20th-century writer who wrote The Lord Of The Flies, delicate describing the intriguing relationship between freedom, responsibility and order. This is done through the unique storyline demonstrating each theme through each character's actions. The book tells the story of a couple of civilized boys who were well brought up in society at 12, being stranded on an island, and how they devolve from their delicate shells of civility into savagery. It also explores how the rules that they once detested, being fundamental in ensuring that society does not fall into chaos.

Throughout the book, freedom and order are juxtaposed between each other. It shows how true order can only be created with no freedom of individuals and vice versa. This is shown in the book by the initial democracy of the boys acting and working together to often have a successful outcome. However, when one plan fails, we can see the turmoil between the children slowly causing cracks in the initial impenetrable democracy. Over a series of unlucky events, some of the children, felt constricted by this democracy enforcing ideas for the greater good and preventing themselves from acting the way they wanted for their own good. It highlights the human instinct to be savage and free rather than being passively restricted by society even though it often leads to the greater good. This is seen as the democracy splits into 2, one of civility and the other of savagery and chaos, in which they fight due to their contrasting views on how order should be obtained. The democracy believes that without rules, no order can be held on the other hand, the other group believes that full freedom of the individual leads to a natural hierarchy in which order can be maintained. The contrast between the 2 sides evokes questions on how society should be ruled and whether we can truly trust each other.

The responsibility a person partakes by joining society is expressed in the book by the acts of each character. This puts the fragility of society in the spotlight, due to the disappearance of responsibility in this chaotic society. This is seen by the slowly deforming standards emphasising how the belief of many is what keeps society together acting as a social glue between the difference in opinions and strength between people. This fragility is not just shown in society but also in the moral values of each person and how one is willing to devolve into harsher and more devious tactics for power. This is emphasised through the short timeline in which they exist on the island, and yet so much chaos caused by the rapid transformation of society's values in the face of danger. The responsibility of their actions which each person upholds, disappears instantaneously in the prospect of a better reward. Many other moral questions are asked throughout the book relating to the theme of responsibility and whether it is one's responsibility to uphold the values one believes in and to what extent can one sacrifice these values.

The book shows the innately harmful and evil human instinct and how one can be driven into doing deplorable acts in times of need and sometimes just for power. It shows how quickly one can change in a new environment. This is shown by the short timeline and how at the end of the book, when they get discovered, they realize the morality of their actions almost as if they were in a trance throughout their time on the island. This realization of the outcomes of what they have done is heavily juxtaposed by their inner self still believing they are still that once civilized person in society.

Overall, The Lord Of The Flies highlights the fragility of society, how fast one can be driven into deplorable acts and the savagery of the human instinct.  This is expressed eloquently through the story of which civilized boys are stranded on an island and their civility disappears expressing the intriguing and difficult relationship of freedom and order. It raises many thought-provoking questions regarding how order can be achieved and whether it is possible to obtain order without infringing on freedom.`,
  },
  {
    _id: "shengyu512@hotmail.com",
    content: `A Christmas Carol is a classical Christmas book written by Charles Dickens and is mainly focused on the themes of Christmas , being indifferent and the injustice in 1843, when the book was first published. It follows a grumpy old man called Ebenezer Scrooge who is quite a wealthy man that has been shaped by his environment into an indifferent, selfish figure with nothing but a cold, icy heart. 

PLOT

At the start of the novel, Scrooge is shown to us as a man of money, only caring about his own happiness and not being able to see the pain he has caused to others through his abusive partnerships. However, as the novel develops, we get an inside look into Scrooge's life and by putting the puzzle together, we see hints as to why Scrooge is what he is. We also get to meet our second protagonist throughout the novel,  Bob Cratchit , a clerk that is working for Mr Scrooge. Bob Cratchit is a bit like a resemblance of everybody who Mr Scrooge has ever come across, except all packed into a single human. We see how Mr Scrooge can affect someone over a long period of time. Bob's old personality, although still kind and weak, has clearly taken its toll. 

However, Scrooge is then visited by three ghosts, The ghosts of past, present and future. After Scrooge's encounter, he starts to change his ways ,the ghosts show him what monster he has become. The ghosts tell him if he doesn't change, then these fates will become a reality. 

This shows how Scrooge has been punished for his very inconsiderate actions. This book is very well written and I would definitely recommend it. It helps explore the idea of karma and the difference between a rich but sad life and a rich but happy life.

CHARACTERS

Ebenezer Scrooge -  A man who at the start of the novel, is shown to be unlike other people, only caring about himself. However he does change by the end of the story.

Bob Cratchit - Scrooge's clerk, he is the very opposite of Scrooge and we see this when he accepts that he won't get a raise for Christmas. He also cares very much for his family and works very hard even though he knows it won't do him ay good.

The ghost of Christmas past - this ghost shows Scrooge his younger self, in more happier times.

The ghost of Christmas present - This ghost represents generosity and goodwill, showing him what people are doing with each other even in those difficult times.

The ghost of Christmas future represents death/ the fear of death, he shows Scrooge what his death will be like and what people will feel towards his death.

This book is a proper classic and another one of Charles Dickens famous books that gives you pleasure to the heart every time you read it. `,
  },
  {
    _id: "joanna.tan20111031@gmail.com",
    content: `Book Review on “A Christmas Carol” by Charles Dickens

         “A Christmas Carol” is a story that takes place in Christmas written by the famous Victorian author Charles Dickens. Not only did he had written and articulated this book very well, he also expressed his own dismay at the Victorian industrial society. The book starts by describing Marley’s death and then starts the real story after explaining the death of Marley and the relationship between he and Scrooge. Overall, Scrooge was an “evil” man at the start of the story written by Dickens but totally changed in the last chapters of this book.

          When Scrooge was suddenly met by a ghost, everything in his life changed. Haunted by the three spirits and the ghost itself, he was threatened by death when the third spirit showed Scrooge’s grave and put him in it, he was given the last chance to live and was never happier than ever. The sudden change of characteristics may confuse the reader when he or she read it for the first time but it is easily comprehended when read many times later. The reason of the change in characteristics was that Scrooge was extremely grateful that he had just escape his own death. 

           Lastly, “A Christmas Carol” is a parable, a tale of a journey towards transformation- and a reformation of beliefs. This timeless classic is also a story of miracles and magic, a homage to the human spirit.`,
  },
  {
    _id: "kouxiaoyu@gmail.com",
    content: `Foxlight
Foxlight is an adventure book written by Carnegie-medal winning author, Katya Balen. The story is set in the Light House, an orphanage, where sisters Fen and Rey live. Their carer, Lissa, tells then that they were found at foxlight where they were snuggled up with a family of red foxes.

Fen, who is older, believes that their real mother doesn’t care about them and neither does she. She is very happy to live in the Light House and she is often filled with silent rage and likes to hide away. Rey is similar but quite different. She is firm in her belief that their mother is searching for them and someday will come to take them back to the wild.

One night, Fen spots a red fox lingering by the fence and she realises that this meant they were ready to find their mother, uncover the truth and clear the confusion between them and the rest of their family. She wakes Rey and tells her it’s time. At first, Rey is not to excited but when she sees the fox, she believes that their mother sent it for them. But the wildlands are exactly that: wild. They steal across the lawn of the Light House, squeeze themselves under the fence before taking in the wilderness standing in front of them. They are not running away at all they are running towards. They start to run after the fox, and into the forest. When Fen takes a tumble, the fox disappears. Rey begins to panic but the pair continue forwards. They take two nights in the forest and still, no sign of their fox. However, on their second night, when they wake up all their provisions are gone. Rey’s paperback is torn into shreds. It doesn’t take long for them to realise that the fox did this. To keep them going. But Fen thinks it’s over, that there’s nothing left to search for especially if there’s nothing left to keep them searching. Rey says they can’t stop as they’ve gotten so far already so they keep walking.

Soon they arrive at an immense valley that sprawls across in every direction, and they find a small shed. It looks dilapidated but it’s shelter. Even better, it has running water and fire to cook on. The pair find a map with 6 houses, each with a small symbol: an acorn, a fox, a flower, a fish, a seed and a dove. Now Fen and Rey realise that right now they are in the acorn house. The next morning, they set off again to find the nearest house-shed to them: the seed house. Eventually, they find the seed house and it’s bigger but not as cosy as the first. The next morning, they set off again but something terrible happens, Fen falls off a small hill they are climbing. Rey tries help her but suddenly, Fen explodes with anger. Rey says she was just trying to help and when she tells her the reason of their journey, Fen just laughs: Rey, what kind of a mother would leave her babies here? Like usual, Rey is determined to find their mother and she leaves Fen alone in the mist. Fen is only focussed on getting home.

On her way home, she sees the fox. Its appearance changes everything for her and she realises she shouldn’t have snapped at Rey the way she did. Fen overcomes different challenges until she arrives at another house-shed and it’s the fox house. Another pair of wild footsteps comes towards her and it’s Rey. They go into the fox house together and there’s nobody inside. No mother. But Rey finds a notebook and when they open it, they are there a drawing of them as babies snuggled up with red foxes. This time they both go home, united and together. They may not have found their mother but they certainly found the truth.

Foxlight: the moment when twilight meets the dawn, and the sun and moon and stars weave their light together.`,
  },
  {
    _id: "12043824@qq.com",
    content: `Overall, I think A Christmas Carol is a very heartwarming story, full of emotions and twists. What I really liked about it was how the author switched from character to character in a very smooth transition, such as when Scrooge was talking to the Ghost of Christmas Yet to Come. This novel also changed the fabric of time itself, ever since that fateful night when Scrooge met the Ghost of Christmas Past, who brought him back in time, and soon after, the Ghost of Christmas Yet to Come, when he brought him into the future. The three Ghosts brought him to his true personality when they opened his eyes to what everyone else thinks about him, opening his world to love, true Christmas spirit, happiness, and joy instead of only cold, hard cash.
	Charles Dickens cleverly hid many small details throughout the plot, including a time travel detail. Every time one of the ghosts comes and visits Scrooge, they always ask him to touch a part of them, The Ghost of Christmas Past, its cap, which Scrooge did unwillingly, The Ghost of Christmas Present, his robe, which Scrooge grabbed as he wanted answers, and The Ghost of Christmas Yet to Come, its scythe, which Scrooge groped with fear and dread.
	 Another small detail is the description of the Ghosts' surroundings. For example, the first Ghost had an aura of uncoverable light beaming from it in every direction, and the second Ghost had plenty of food, drinks, and decorations usually seen on the dinner table at Christmas. The last Ghost had a blackness surrounding him, full of dark memories and feelings from all the bad Christmases that happened. Only a reviewer deeply focused on the story will find these little Easter eggs, just like in every type of art known to man: Video games, artwork, music, stories, and architecture, with many more that I have not named.
	The plot mostly circles around Scrooge turning from the old, selfish, mean and cold pater he was into a generous, happy and embracing man that spreads joy instead of mean spirits. The plot is generally talking about Scrooge's life from his childhood to his adulthood, from his first love to when she went away. It is trying to send a positive message telling us that no matter how bitter or sad a person is, he or she can still turn into a joyful person.
	Another moral that we can deduct from this book is that sharing really is caring. Scrooge, for example, did not give Bob Cratchit a larger sum of money even though it was a day of giving: Christmas. Bob desperately needs the money because his son, Tiny Tim, is dreadfully ill, and his parents can't afford to treat him due to the meager salary Scrooge reluctantly gives Bob. After seeing him face-to-face for the first time, Scrooge; now a happier man, shamefully remembers that day when he refused to give Bob the money and decides to help Tim and his entire family, by eating dinner with the family and sharing his wealth and finally, his happiness with those who do care about him.
	The story also explores how a person's feelings, emotions and personality can be affected by the past, or/and the future. Scrooge's case, for example, is heavily affected by the past when he still remembers how his love left him and all the failures he encountered before he acquired his wealth. So that's why, when The Ghost of Christmas Past showed him the past, he angrily slammed its cap down on top of it, trying to smother the lights beaming from it, but he did not succeed because nothing could hide the truth.
        In conclusion, A Christmas Carol is a very heartwarming story, full of surprises and joy, and has many morals that we can learn. Every page is a new story, every chapter a novel, just like our lives. Scrooge looked at the future and changed just in time to still enjoy life and Christmas and happiness. Everyone can learn from his mistakes and become a better them. Scrooge kept blaming himself and everyone for his unhappiness, but truly, the problem was inside him. So, everyone should look a little deeper instead of always blaming others.`,
  },
  {
    _id: "yangyunqi425@gmail.com",
    content: `You might have heard the saying “ Don’t be a scrooge” muttered over the years whenever somebody’s, well, being a scrooge. The famous saying was inspired by the famous book, A Christmas Carol by Charles Dickens. In Dickens’ book, the main character, Ebenezer Scrooge, is a well known ‘ penny pincher’ who absolutely despises children, happiness and most of all, Christmas. 
	Dickens has a special way with words. He’s often blunt yet fascinating and sullen yet entertaining. He starts off the book with a sentence I’ve yet to forget: “ Marley was dead, to begin with. There is no doubt about that.[...] Old Marley was as dead as a door-nail”(1). This sentence stuck in my mind even after I completed reading the whole book. Perhaps it was because of how straightforward the narrator presented the fact that Marley was dead. Or perhaps it was the hilarious way the narrator then proceeded to question his own words on just how dead a doornail could be. Dickens first announced a tragic news, to set a solemn mood for the readers, then immediately backtracks his steps, jocking lightly to lift the mood, so he could then state “ There is no doubt that Marley was dead. This must be distinctly understood, or nothing wonderful can come out of this story I am going to relate”(2). The choice of how to present this sequence of events and facts to the reader is certainly a unique choice, and a style different from other authors. How Dickens managed to turn a death into a joke, then a joke into a blunt fact. 
	Throughout the book, Ebenezer Scrooge is often made a joke by the narrator to provide a source of laughter for the readers, as well as a chance for the author to repeatedly state the kind of man he is before all the events that occur in the book change him forever. In the beginning of Stave One, Scrooge is described as “ a tight fisted hand at the grindstone, Scrooge!a squeezing wrenching, grasping, scraping, clutching covetous old sinner! Hard and Sharp as flint, from which no steel had ever struck out a generous fire, secret, and self contained, and solitary as an oyster.[...] He carried his own low temperature always about him; he iced his office in the dog days; and didn’t thaw it one degree at Christmas(3). Dickens successfully draws an image of a cold selfish man who keeps to himself in the reader's mind, allowing Scrooge's unpleasant  personality to shine, therefore creating a beggar contrast between his former self and his new self at the end of the book. It’s quite amazing how Charles Dickens manages to create a world with such vividly descriptive characters with the power of a few words. Scrooge is known as a greedy, selfish person, who is unlikely to provide anything more than a small piece of coal for his clerk, owning up to the sentence “ from which no steel had ever struck out a generous fire(3). The “ dog days” in the quote refer to the summer days, when the coldness in Scrooge’s office matches the temperature of it in the winter. This is to symbolize the coldness Scrooge always carries with him, how it settles in the air surrounding him, affecting anybody who dared to come near.
	Many don’t realize it, but words can often be as powerful as weapons. Many authors have mastered and tamed this weapon, using it to weave together stories that leave the reader feeling a mix of emotions, and often thinking about it even after finishing a book. Charles Dickens definitely worked his magic with words to create A Christmas Carol, to be able to teach a lesson to all his readers as well as give them a hilarious entertainment at the same time.`,
  },
  {
    _id: "87023918@QQ.com",
    content: `Harry Potter and the Goblet of Fire 

Harry Potter and the Goblet of Fire is the fourth book of the harry potter series. The series about skinny boy with jet black hair who turned out to be a wizard bullied by his aunt, uncle and cousin.

The Plot
 The Triwizard Tournament is to be held at Hogwarts. Only wizards of age (seventeen or older) can compete-but that doesn’t stop Harry who is only fourteen dreaming that he will win. However, harry is amazed that his name was chosen. He faces dangerous tasks such as dragons and merepeople. But the biggest shock was when Lord Voldemort returns once again at the end of the school year.

The Characters
 In the book there are Ron Weasley and Hermione Granger who are Harry’s best friends along all his classmate his teachers like Professor Dumbledore and Professor McGonagall as well as Voldemort who comes later in the book. 

This book is amazing and is my second favourite of the whole series. I cannot stop reading it and the other books. It is action packed with many exhilarating events and mysteries. I would recommend this book for children and adults. I love the book and would give it a 10/10!`,
  },
  {
    _id: "huioukan@gmail.com",
    content: `Neverseen (book 4 from Keeper of the Lost Cities) book review:
 Written by Shannon Messenger, Neverseen is a fascinating book full of unpredictable surprises that captivate the reader into the enthralling Elvin world. A twelve-year-old girl named Sophie Foster has extraordinary abilities which allow her to do things beyond imagination. The question is, is she able to protect all of her friends while facing their most threatening foes?

The story continues from the earlier book where Sophie and her friends are taking a break from the devastating events that took place previously. They are now currently members of the Black Swan- a rebel group working to improve the world and stop groups such as the Neverseen. Little do they know, the Neverseen has much more information on Sophie Elizabeth Foster than she could have guessed.

As Sophie discovers more about the opposing organization, she realizes that , not only do they have incredible abilities and skills, they also seem to have a personal grudge on Sophie and who she cares about. The author carefully weaves a web of secrets and lies, making the reader want to finish the sequel to answer all of the questions they have in their mind. The most important one is who can they trust.

One of the most defining characteristics of the book is the way Shannon Messenger brings the story to life by using vivid description and all five senses to illustrate how different the elves live, from the lush, green environment to their unique abilities and customs they have. The writer creates new creatures, factions and artifacts to introduce throughout the whole book; keeping you tense and eager to find out what happens next.

In addition, Messenger goes into detail about the personal growth and relationships of the central characters. Sophie struggles with her special abilities and the importance they hold for the future. Her strong group of friends, adoptive family and the mysterious Fitz Vacker add different kinds of emotions to the story, drawing readers deeper into the heart of the book.

One area for improvement is that the pacing can be inconsistent, with some parts being quickly introduced, while others are being thoroughly described for more than a page. However, this is only a minor problem from the overall reading experience, as the author’s transfixing writing and the twisting and turning of the plot keep the pages turning.

In conclusion, I believe that Neverseen is one of the best additions to the Keeper of the Lost Cities, letting readers into gripping adventure and explore the experiences each character has to go through. Personally, I am a huge fan of Keeper of the Lost Cities and I can’t wait to finish the entire series. I would strongly recommend this book (and the ones before and after it) to anyone who likes fantasy and adventure stories. Neverseen is a must-read book that will never be forgotten once you read the final word.`,
  },
  {
    _id: "albertwang202901@slis.net.cn",
    content: `"A Christmas Carol" is a heartwarming tale that has stood the test of time, being published in 1843, and yet still having a huge cultural impact, delivering a profound message about the spirit of Christmas and the transformative power of redemption. Charles Dickens masterfully weaves a narrative that is both a critique of the social ills of his time and a beacon of hope for the human capacity for change. 

 

The story centers around Ebenezer Scrooge, a miserly and cold-hearted man who has alienated himself from his family and society. On Christmas Eve, he is visited by the ghost of his former business partner, Jacob Marley, and three spirits who take him on a journey through his past, present, and a glimpse into his future if he continues on the same path. 

 

Dickens' portrayal of Scrooge is nothing short of brilliant. The character's transformation from a bitter, greedy man to a benevolent figure who embraces the joy of giving and the true meaning of Christmas is both believable and deeply satisfying. The author's use of vivid imagery and dialogue brings the story to life, immersing the reader in the Victorian era and its stark contrasts between wealth and poverty. 

 

One of the most enduring aspects of "A Christmas Carol" is its exploration of themes such as charity, kindness, and the importance of family and community. Dickens challenges the reader to reflect on their own values and actions, urging them to embrace the spirit of generosity and compassion that the story embodies. 

 

The language is rich and evocative, with Dickens' signature wit and social commentary shining through. The novella is a quick read, yet its impact is profound, making it a must-read for anyone seeking the true essence of the Christmas spirit. 

 

In conclusion, "A Christmas Carol" is not just a story for the holiday season; it is a timeless reminder of the power of change and the importance of human connection. Dickens' work continues to resonate with readers of all ages, making it a cherished piece of literature that will undoubtedly continue to be celebrated for generations to come. 
`,
  },
  {
    _id: "evelynkan0106@icloud.com",
    content: `La belle Sauvage, the first book of the ‘Book Of Dust Triology’ by Phillip Pullman follows a Malcom Polstead a young adolescent whose life takes a sudden turn when he meets and infant named Lyra  Belacqua. Philip Pullman masterfully crafts a narrative that unfolds with deliberate pacing, laying a rich foundation for world-building and character development within this alternate realm.
The inclusion of familiar 'His Dark Materials' characters allows for a great deal of nostalgia to seep in for the older reader, though their appearances are more nods to readers than pivotal plot points for new readers. The action rises to a climax in the form of a biblical flood, whereupon Malcolm, accompanied by his friend Alice and their daemons, makes the treacherous journey down the river on board La Belle Sauvage, meeting a tapestry of mysterious characters and venturing into a secretive commonwealth.
The subtle way events unravel in the story allows for deep emotional investment in its characters and their plight, more specifically in Malcolm's resilience and camaraderie with Alice to safeguard young Lyra and her daemon Pantalaimon. Subtle portrayals of such sensitive heroes by Pullman evoke real empathy from the readers, eliciting feelings for their struggles and triumphs.
Overall, I would rate this book a solid ten out ten and recommend it for readers aged twelve and above. The mix of suspense, adventure, and poignancy held really well as the story picked up in its latter half. Pullman has interwoven strands of expectation and disclosure that make this a wild ride of familiar themes tied with promise, illuminating new narrative lands to explore for both newcomers and long-time series fans. But "La Belle Sauvage" is as much a work of vivid imagination and creative evocation as Pullman's storytelling powers ever were, immersing the reader into an engrossing tale that will leave a lot long after the final page is turned.`,
  },
  {
    _id: "hollyhua831@googlemail.com",
    content: `The Storm Breaker is a book full of action and it's thrilling And captivating written by Antony Fauthone carefully. Will he fail his mission that his uncle left him? Will he be captured by the enemies? How will he finish his homework? This book will take you on an adventure as he discovers the secrets of his uncle and was set on a mission to stop the deadly verses from permeating trom from all school in England.

This book is engaging and captivating for the ready reader to read. Once your eyes land on the book, you can never take them off. This book is about a young teenager (both of his parents has died already when he was young) and he was left with his only relative : his uncle. After school, he found out his uncle had died in a car crash but later discovers the truth that he wasn't working for a bank but something else... He later was recruited by MI6 to join the secret British service. He later that his uncle left behind and discovered that he missions unfinished and he is to finish them off for his uncle.This book asso explores adventure, courge and trasition from adolescence to adult hood. Antong Thronghout the book, Antony creates aspects such as soung, tone and makes souspense and action. I think the book is really intresting and consistently creates tension and suspense in the book but sometimes hol makes the story a bit confusing and hard to understand.

Overall I think the book was fascinating and it always kept me interested and intrigued from the start to the end and as a rating out of 10 it would be 7/10`,
  },
  {
    _id: "lilylc009@gmail.com",
    content: `Pride and Prejudice: Book vs. Film 
Jane Austen's "Pride and Prejudice" is one of the most beloved novels in English literature. Published in 1813, this classic tale of love, class, and social expectations has been adapted into numerous films and television series. While both the book and its film adaptations tell the same basic story, the experiences they offer can be surprisingly different. Let's explore how the written word compares to its cinematic renditions.
The Novel
Austen's novel is a masterful exploration of the social fabric of early 19th century England. Through the eyes of Elizabeth Bennet, the second of five sisters, readers are drawn into a world where marriage and social standing are of utmost importance. The novel's strength lies in its rich character development and the subtle irony that Austen weaves throughout her prose. Each character, from the proud Mr. Darcy to the meddlesome Mrs. Bennet, is given depth and nuance. The narrative voice, often tinged with wit and sarcasm, invites readers to reflect on the absurdities of societal norms.
In the novel, the development of Elizabeth and Darcy's relationship is gradual and intricate. Their initial misunderstandings and prejudices give way to mutual respect and affection, revealing how first impressions can be misleading. Austen carefully constructs this transformation, providing readers with insight into both characters' inner thoughts and feelings. This depth of character is a hallmark of the novel and something that fans often find missing in film adaptations.
The Film:
Film adaptations of "Pride and Prejudice" vary greatly, but they all share the challenge of condensing a 124 713-word, 432-page novel into a few hours of screen time. The most acclaimed adaptations, such as the 1995 BBC miniseries starring Colin Firth and Jennifer Ehle and the 2005 film featuring Keira Knightley and Matthew Macfadyen, each bring their unique interpretation to Austen's work.
One of the key differences between the book and its adaptations is the portrayal of characters. In the film, the visual medium allows for a more immediate emotional connection. For instance, the chemistry between the lead actors can convey the tension and eventual affection between Elizabeth and Darcy without the need for extensive dialogue. However, this also means that some of the subtler aspects of Austen's characterisations and themes may be lost or simplified.
Additionally, the setting and costumes in films play a crucial role in bringing the period to life, something that words alone cannot fully capture. The sweeping English countryside, the grandiose estates, and the elegant attire all add to the viewer's immersion in the story. The visual appeal of these adaptations can make the social and class distinctions of the period more tangible and relatable to modern audiences.
Book vs. Film:
While the book offers a deeper dive into the characters and themes, the films provide a visual and emotional immediacy that can be equally compelling. For purists, the novel remains the definitive "Pride and Prejudice," offering all the intricate details of Austen's world. However, for those new to the story or seeking a quick immersion, the films provide a beautifully condensed version that captures the essence of the narrative.
In conclusion, both the book and its film adaptations have their unique strengths. They cater to different preferences and serve as complementary experiences rather than competitors. Whether you choose to read the novel or watch a film, you're engaging with a timeless story that continues to resonate across generations.`,
  },
  {
    _id: "niuying0788@outlook.com",
    content: `The film ‘She’s The Man’ is a 2006 American romantic-comedy, starring Amanda Bynes as Viola Hastings, Viola is a 17-year-old, hardcore tomboy, who goes deep undercover as her twin brother. The film follows her experience as she tries to prove she can keep up with her rival high school’s boy’s team, after learning that her all-girls soccer team is being shut down. Will she successfully fool everyone with her new identity?

“She's the Man" is a modern adaptation of William Shakespeare's “twelfth night”. The film used a few character names from the original play, like Viola, Olivia, and Sebastian, and it also shares similar themes to those found in the play, such as changing identities and unrequited love. This film brings Shakespeare's play to life with a fun modern twist, by plopping it into an unapologetically American high school. The perfect for an entertaining family night. 

Now, I would just like to say that I love this movie for what it is. A hilarious teen flick that is also cheesy, sappy and just the right amount weird. When Viola puts on her disguise, which consists of fake sideburns and a wig, suddenly she becomes the most socially awkward nerd 'boy' you've ever seen. However, all the other characters appears to be oblivious to the facts that are so obvious to the audience. The laughs when Viola somehow gets away with the pathetic attempt of a disguise is honestly the best part about the movie.

This film also delve into world-wide issues such as gender roles way before the rest of the film industry caught on. "She's the man" feds into extremely stereotypical characters such as a classic "damsel in distress" and a "hero" who comes to rescue her. As a girl, it was unexpectedly eye-opening to see a woman being the main character and being presented positively.  Viola not only takes on a boy's spot on an all-male soccer team and become not just good, but greater than them through hard work and perseverance. It is so uncommon for a quick, family-friendly rom-com movie to have such a deep lesson and moral, which explores deep-rooted societal struggles, but this film has it all. 

"She's the man" is absolutely timeless and somehow manages to become funnier every time you watch it. This fun little teen drama will definitely be remembered by me for a while. Even though the plot is a tad cliché and predictable, you'll be laughing to tears and cringing the whole way through. I strongly recommend this movie to anyone who is looking for a light rom-com or just a funny, fast-paced comfort movie.`,
  },
  {
    _id: "hliang178@yahoo.com.hk",
    content: `London Has Fallen
The sequel to the award-winning film Olympus Has Fallen, Mike Banning, an elite Secret Service agent, must once again help the President of The United States escape after he discovers a plot to attack all the world leaders attending the funeral of the British Prime Minister James Wilson. 

At the start of the film, upon arriving in London aboard Marine 1, seeming allies turn into foes when one by one, a large army of mercenaries launch coordinated attacks on the city, disguised as Metropolian Police, the Queen’s Guardsmen and other first responders, killing multiple world leaders, damaging major landmarks and causing mass panic. With nobody left who they can trust, Mike Banning and President Asher only have each other left. Threatened to be publicly executed online, it’s up to Mike to save the US President – again.

Anyone familiar with action films will expect a thrilling and edge-of-your-seat vibe. This film captures it amazingly in multiple scenes, and showcases the impressive combat skills and training needed of the Secret Service, as agent Mike Banning takes down enemy after enemy with little to no difficult; an impressive demonstration of his spatial awareness and seeming immunity. However, it’s not all a one-sided battle, as the true thrill happens when under the watchful eye of Mike Banning, the mercenaries manage to kidnap the president, and whisk him away to some unknown location. Just a few seconds later, London’s elite Special Force arrives, and in a display of pure loyalty to the President, demands that they either allow him to come with the team to rescue the President, or they kill him instead. The Special Forces decided on the latter.

However, throughout the movie, we get the growing sense that Mike Banning is more than just a Secret Service agent, as he takes down mercenary after mercenary without a single drop of remorse. The relationship and trust, however between the President and Mike is unwaveringly convincing. President Asher has his moments of hesitation when his help is needed to fight off the “bad guys”, who arrive in multiple waves, but in the end, like a true President, he finds the courage to launch the smoke grenade, or guard the entrance. 

The thrilling writing is brought to life by impressive camera angles, editing and music, making every viewer wish that they were Mike Banning in his moments of glory. This does make it difficult for viewers to imagine this in real life, but it does create a glorious hypothetical situation that Secret Service agents likely have to train for.

This film will not be everyone’s cup of tea. The amount of violence, combat and profanities as Mike Banning and the President attempt to outwit the Middle-Eastern mercenaries. This is not a film you’d want to enjoy on a date night with popcorn and drinks. This is a film for the most dedicated of action Film fans.

Overall, the film London Has Fallen is well worth watching, both for the story and the principles behind it. But be prepared for the ideas of nationalism to stick with you for a long time. It will make you question what you think you know and challenge you to look under the cover of the book.`,
  },
];

const getApiKey = () => process.env.GPT_API_KEY;
// Function to preprocess text into chunks

const apiKey = getApiKey();
const apiUrl = "https://api.openai.com/v1/chat/completions";

async function getComparativeScores(stories) {
  let scores = {};

  // Pairwise comparison of stories
  for (let i = 0; i < stories.length; i++) {
    for (let j = i + 1; j < stories.length; j++) {
      const storyA = stories[i];
      const storyB = stories[j];
      const prompt = `
        Evaluate the following two stories and determine which one is better.
        ${storyA._id} : ${storyA.content}
        ${storyB._id} : ${storyB.content}
        Please respond only one word with the ID of the better story nothing else. The story should be the same given in the prompt.` ;

      try {
        const response = await axios.post(
          apiUrl,
          {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content:
                  "You are an AI tasked with evaluating stories based on their strengths and weaknesses. Each evaluation should capture the key aspects of each story's content, coherence, creativity, character development, emotional impact, and language style. These evaluations will be used to rank the stories in subsequent steps. Prompt is given in this format: `storyId` : `storyContent`.  Please respond only one word with the `storyId` of the better story nothing else not even a fullstop after a `storyId`. ",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: prompt.split(" ").length + 50,
          },
          {
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          }
        );

        const betterStoryId = response.data.choices[0].message.content.trim();
        // console.log("res ", response.data.choices[0].message.content);
        console.log("beeter story id", betterStoryId);
        // Increment the score for the better story
        if (scores[betterStoryId]) {
          scores[betterStoryId]++;
        } else {
          scores[betterStoryId] = 1;
        }
      } catch (error) {
        console.error(`Error comparing stories: ${error}`);
      }
    }
  }

  return scores;
}

async function rankStories(stories) {
  const scores = await getComparativeScores(stories);

  // Convert scores object to array for sorting
  const sortedStories = Object.keys(scores).map((storyId) => {
    return {
      story_id: storyId,
      score: scores[storyId],
    };
  });

  // Sort stories by score in descending order
  sortedStories.sort((a, b) => b.score - a.score);

  // Assign positions based on sorted order
  sortedStories.forEach((story, index) => {
    story.position = index + 1;
  });

  return sortedStories;
}

rankStories(stories)
  .then((rankedStories) => {
    console.log(rankedStories);
  })
  .catch((error) => {
    console.error("Error ranking stories:", error);
  });
