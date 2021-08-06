let config = {
  development: {
    dbUrl:
      "mongodb+srv://cococa:NbBo9VVOjK9c0zo5@cluster0.tha6x.mongodb.net/cococa-test?retryWrites=true&w=majority",
    secret:
      "B(@{|j;$OWH7<5nI-=}B@W3J6cbasdadrdy^-V2QzfK2ggg0K$IaHsU8/GgviIov(I2VB7<7",
  },
  production: {
    dbUrl:
      "mongodb+srv://cococa:NbBo9VVOjK9c0zo5@cluster0.tha6x.mongodb.net/cococa?retryWrites=true&w=majority",
    secret:
      "B(@{|j;$OWH7<5nI-=}B@W3J6sdadadcbrdy^-V2QzfK2ggg0K$IaHsU8/GgviIov(I2VB7<7",
  },
};
module.exports = config;
