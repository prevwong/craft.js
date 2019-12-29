yarn build

lerna run export --stream
rm -rf site/
mkdir site
cp -r ./packages/examples/landing/out/* site/
touch site/.nojekyll
cp -r ./packages/docs/build site/r
mkdir site/examples
cp -r ./packages/examples/basic/out/ site/examples/basic

STATUS="$(git status)"

if [[ $STATUS == *"nothing to commit, working tree clean"* ]]
then
    sed -i "" '/site/d' ./.gitignore
    git add .
    git commit -m "Deployment"
    git push origin `git subtree split --prefix site master`:gh-pages --force
    git reset HEAD~
    git checkout .gitignore
else
    echo "Need clean working directory to publish"
fi