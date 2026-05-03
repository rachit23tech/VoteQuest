/**
 * Built-in quiz questions for offline use.
 * When Gemini AI is available, these are supplemented by AI-generated questions.
 */
export const QUIZ_BANKS = {
  basics: [
    { question: "What does 'democracy' literally mean?", options: ["Rule of law", "Power of the people", "Government control", "Military rule"], correct: 1, explanation: "Democracy comes from Greek: 'demos' (people) + 'kratos' (power/rule).", difficulty: "easy", xp: 10 },
    { question: "India follows which type of democracy?", options: ["Direct democracy", "Representative democracy", "Authoritarian democracy", "Presidential democracy"], correct: 1, explanation: "India is a representative (parliamentary) democracy where citizens elect representatives.", difficulty: "easy", xp: 10 },
    { question: "What is universal adult suffrage?", options: ["Only educated can vote", "Only taxpayers can vote", "Every adult citizen can vote", "Only property owners can vote"], correct: 2, explanation: "Universal adult suffrage means every citizen above a certain age (18 in India) has the right to vote, regardless of class, gender, or education.", difficulty: "easy", xp: 10 },
    { question: "How many eligible voters does India have (approx.)?", options: ["500 million", "700 million", "960 million", "1.4 billion"], correct: 2, explanation: "India has approximately 960+ million eligible voters, making it the world's largest democracy.", difficulty: "medium", xp: 20 },
    { question: "When was the first general election held in India?", options: ["1947", "1950", "1951-52", "1955"], correct: 2, explanation: "India's first general election was held from October 1951 to February 1952.", difficulty: "medium", xp: 20 },
  ],
  eci: [
    { question: "Which article establishes the Election Commission of India?", options: ["Article 280", "Article 312", "Article 324", "Article 356"], correct: 2, explanation: "Article 324 vests the superintendence, direction, and control of elections in the ECI.", difficulty: "medium", xp: 20 },
    { question: "When was the ECI established?", options: ["15 Aug 1947", "26 Jan 1950", "26 Nov 1949", "1 Jan 1951"], correct: 1, explanation: "The ECI was established on 25th January 1950, the same day the Constitution came into effect.", difficulty: "easy", xp: 10 },
    { question: "How many members does the ECI currently have?", options: ["1", "2", "3", "5"], correct: 2, explanation: "The ECI has 3 members: 1 Chief Election Commissioner and 2 Election Commissioners.", difficulty: "easy", xp: 10 },
    { question: "How can the CEC be removed from office?", options: ["By the President", "By the Prime Minister", "Through impeachment", "By Parliament vote"], correct: 2, explanation: "The CEC can only be removed through impeachment — the same process as for a Supreme Court judge.", difficulty: "hard", xp: 30 },
    { question: "Which of these elections is NOT conducted by the ECI?", options: ["Lok Sabha", "Rajya Sabha", "Panchayat", "Presidential"], correct: 2, explanation: "Panchayat elections are conducted by State Election Commissions, not the ECI.", difficulty: "hard", xp: 30 },
  ],
  voter: [
    { question: "What is the minimum age to vote in India?", options: ["16 years", "18 years", "21 years", "25 years"], correct: 1, explanation: "Article 326 sets the minimum voting age at 18, reduced from 21 by the 61st Amendment (1988).", difficulty: "easy", xp: 10 },
    { question: "What form is used for new voter registration?", options: ["Form 2", "Form 6", "Form 8", "Form 10"], correct: 1, explanation: "Form 6 is used for new voter registration. It can be filled online at nvsp.in.", difficulty: "medium", xp: 20 },
    { question: "What does EPIC stand for?", options: ["Election Process Identity Card", "Electors Photo Identity Card", "Electoral Permission Identity Certificate", "Election Participation ID Card"], correct: 1, explanation: "EPIC = Electors Photo Identity Card, commonly known as Voter ID card.", difficulty: "easy", xp: 10 },
    { question: "Can NRI citizens vote in Indian elections?", options: ["No, never", "Yes, with restrictions", "Only in local elections", "Only in presidential elections"], correct: 1, explanation: "NRIs can register as voters and vote in person at their registered constituency.", difficulty: "medium", xp: 20 },
    { question: "On what date must you be 18 to be eligible for that year's roll?", options: ["Your birthday", "1st January", "26th January", "15th August"], correct: 1, explanation: "You must be 18 on or before January 1st of the year the electoral roll is revised.", difficulty: "hard", xp: 30 },
  ],
  process: [
    { question: "What is the Model Code of Conduct?", options: ["A law passed by Parliament", "Guidelines for parties during elections", "Rules for voters", "Constitutional provisions"], correct: 1, explanation: "The MCC is a set of guidelines (not a law) for political parties and candidates during elections.", difficulty: "easy", xp: 10 },
    { question: "When does the MCC come into effect?", options: ["On polling day", "When nominations start", "When elections are announced", "30 days before voting"], correct: 2, explanation: "The MCC comes into force the moment the ECI announces election dates.", difficulty: "medium", xp: 20 },
    { question: "How long before polling must campaigning stop?", options: ["24 hours", "48 hours", "72 hours", "1 week"], correct: 1, explanation: "Campaigning must stop 48 hours before polling day — this is the 'silence period'.", difficulty: "easy", xp: 10 },
    { question: "What is the security deposit for a Lok Sabha candidate?", options: ["₹10,000", "₹15,000", "₹25,000", "₹50,000"], correct: 2, explanation: "Lok Sabha candidates deposit ₹25,000 (₹12,500 for SC/ST candidates).", difficulty: "medium", xp: 20 },
    { question: "What happens if a candidate gets less than 1/6th of total valid votes?", options: ["Nothing", "They lose their deposit", "They are banned from future elections", "They pay a fine"], correct: 1, explanation: "Candidates who don't secure at least 1/6th of valid votes forfeit their security deposit.", difficulty: "hard", xp: 30 },
  ],
  evm: [
    { question: "When were EVMs first used in India?", options: ["1977", "1982", "1989", "1998"], correct: 1, explanation: "EVMs were first used in 1982 in the Parur Assembly constituency of Kerala.", difficulty: "medium", xp: 20 },
    { question: "What does VVPAT stand for?", options: ["Voter Verified Paper Audit Trail", "Vote Validation Paper Authentication Technology", "Voter Verification And Processing Tool", "Valid Vote Paper Audit Technology"], correct: 0, explanation: "VVPAT = Voter Verifiable Paper Audit Trail, introduced for transparency.", difficulty: "easy", xp: 10 },
    { question: "How long is the VVPAT slip visible to the voter?", options: ["3 seconds", "5 seconds", "7 seconds", "10 seconds"], correct: 2, explanation: "The VVPAT paper slip is visible through a window for 7 seconds before dropping into the sealed box.", difficulty: "medium", xp: 20 },
    { question: "Are EVMs connected to the internet?", options: ["Yes, for live counting", "Yes, for security", "No, they are standalone", "Only during counting"], correct: 2, explanation: "EVMs are completely standalone devices — no network connectivity whatsoever. This is a key security feature.", difficulty: "easy", xp: 10 },
    { question: "Who manufactures EVMs in India?", options: ["Private companies", "Foreign companies", "BEL and ECIL (government companies)", "IIT labs"], correct: 2, explanation: "EVMs are manufactured by Bharat Electronics Limited (BEL) and Electronics Corporation of India Limited (ECIL).", difficulty: "hard", xp: 30 },
  ],
};

export function getQuizByTopic(topicId) {
  return QUIZ_BANKS[topicId] || QUIZ_BANKS.basics;
}
