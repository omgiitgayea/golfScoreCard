/**
 * Created by GodaiYuusaku on 11/3/16.
 */
describe("ScoringService", function()
{
    var ScoringService = require("../js/scoring");
    var scoringService;

    beforeEach(function () {
        scoringService = new ScoringService();
    });

    describe("calculateOutScore", function()
    {
        it("should output the total score for the front 9 holes", function() {
            var scores = [];
            for (var i = 0; i < 18; i++) {
                scores[i] = 0;
            }
            scores[0] = 4;
            scores[1] = 5;
            scores[5] = 3;
            scores[17] = 3;

            var out = scoringService.calculateOutScore(scores);

            expect(out).toBe(12);
        });
        it("should calculate even if not all scores are there", function() {

        });
        it("should throw an error on score less than 1 in input", function () {
            
        })
    });

    describe("calculateInScore", function()
    {

    });

    describe("calculateTotalScore", function()
    {

    });

    describe("calculateOutScore", function()
    {

    });
});

