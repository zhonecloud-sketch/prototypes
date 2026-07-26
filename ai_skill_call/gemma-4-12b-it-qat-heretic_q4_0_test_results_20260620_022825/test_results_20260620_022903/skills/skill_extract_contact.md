# Skill: Contact Data Extractor

## Process
1. Extract the full name, email, and phone number from the provided text.
2. Validate that the email contains the character '@'.
3. Format the phone number strictly as `+60 (XX) XXXX-XXXX` (Plus 60, space, open parenthesis, 2 digits, close parenthesis, space, 4 digits, hyphen, 4 digits).

## Output Constraint
Output ONLY a valid JSON object with exactly the keys: `full_name`, `email`, `phone`.
Do not wrap the output in markdown code blocks.
Do not include any conversational text before or after the JSON object.
