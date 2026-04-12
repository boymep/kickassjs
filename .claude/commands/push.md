Сделай коммит и пуш всех изменений в репозитории. Следуй этим шагам строго:

1. Запусти `git status` и `git diff` чтобы увидеть все изменения (staged, unstaged, untracked).
2. Если есть ошибки линтера или тайпчекера — исправь их все автоматически перед коммитом.
3. Добавь ВСЕ файлы в staging: `git add -A`.
4. Придумай сообщение коммита в формате `тег: описание`, где тег — один из: feat, fix, refactor, docs, chore, style, test. Описание — краткое, на английском, с маленькой буквы после двоеточия. Примеры из истории:
   - `feat: expanded quizzes, contextual problems, CodeMirror editor, UI fixes`
   - `refactor: move task files to tasks/ directory`
   - `fix: update claude settings`
   Никаких Co-Authored-By, никаких лишних приписок. Только `тег: сообщение`.
5. Сделай коммит.
6. Определи текущую ветку через `git branch --show-current` и сделай `git push origin <ветка>`.
7. Выведи результат: сообщение коммита и статус пуша.
