# Skill: Log Analyzer

## Process
1. Count lines containing "INFO", "WARNING", and "ERROR" (case-insensitive matching).
2. Determine the Status for EACH ROW individually based on its Level:
   - If the row's Level is "ERROR", its Status is "CRITICAL".
   - If the row's Level is "INFO" or "WARNING", its Status is "HEALTHY".

## Output Constraint
1. Output a Markdown table with headers: `| Level | Count | Status |` and exactly 3 rows (one row per level).
2. After the table, append a single line starting with `Summary: `.
3. **NEGATIVE CONSTRAINT:** In the "Summary: " line, you MUST NOT use the words "error", "fail", or "crash" (case-insensitive). Use "issue" or "fault" instead.
4. No text before the Markdown table.
