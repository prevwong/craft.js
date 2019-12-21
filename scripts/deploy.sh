STATUS="$(git status)"

if [[ $STATUS == *"nothing to commit, working tree clean"* ]]
then
    sed -i "" '/site/d' ./.gitignore
    git add .
    git commit -m "Edit .gitignore to publish"
    git subtree push --prefix site origin gh-pages
    git reset HEAD~
    git checkout .gitignore
else
    echo "Need clean working directory to publish"
fi