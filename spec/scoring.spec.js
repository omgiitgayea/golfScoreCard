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
        it("should throw an error if any input is not a number", function () {
            var undefinedScores = [];
            var letterScores = ["b"];
            var symbolScores = ["%"];
            
            function undefinedInputs ()
            {
                scoringService.calculateOutScore(undefinedScores);
            }
            
            function letterInputs() {
                scoringService.calculateOutScore(letterScores);
            }
            
            function symbolInputs() {
                scoringService.calculateOutScore(symbolScores);
            }

            expect(undefinedInputs).toThrow();
            expect(letterInputs).toThrow();
            expect(symbolInputs).toThrow();
        });

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
            var scores = [];
            for (var i = 0; i < 18; i++)
            {
                scores[i] = 0;
            }
            scores[0] = 4;
            scores[1] = 3;

            var out = scoringService.calculateOutScore(scores);

            expect(out).toBe(7);
            expect(function () {
                scoringService.calculateOutScore(scores);
            }).not.toThrow();
        });
        
        it("should throw an error on score less than 1 in input", function () {
            var scores = [];
            for (var i = 0; i < 18; i++) {
                scores[i] = 0;
            }
            scores[3] = -2;

            function errorCheck() {
                scoringService.calculateOutScore(scores);
            }

            expect(errorCheck).toThrow();
        })
    });

    describe("calculateInScore", function()
    {
        it("should throw an error if any input is not a number", function () {
            var undefinedScores = [];
            var letterScores = ["b"];
            var symbolScores = ["%"];

            function undefinedInputs ()
            {
                scoringService.calculateInScore(undefinedScores);
            }

            function letterInputs() {
                scoringService.calculateInScore(letterScores);
            }

            function symbolInputs() {
                scoringService.calculateInScore(symbolScores);
            }

            expect(undefinedInputs).toThrow();
            expect(letterInputs).toThrow();
            expect(symbolInputs).toThrow();
        });

        it("should output the total score for the back 9 holes", function() {
            var scores = [];
            for (var i = 0; i < 18; i++) {
                scores[i] = 0;
            }
            scores[0] = 4;

            scores[9] = 5;
            scores[12] = 3;
            scores[17] = 3;

            var inScore = scoringService.calculateInScore(scores);

            expect(inScore).toBe(11);
        });

        it("should calculate even if not all scores are there", function() {
            var scores = [];
            for (var i = 0; i < 18; i++)
            {
                scores[i] = 0;
            }
            scores[0] = 4;

            scores[9] = 5;
            scores[12] = 3;
            scores[17] = 3;

            var inScore = scoringService.calculateInScore(scores);

            expect(inScore).toBe(11);
            expect(function () {
                scoringService.calculateInScore(scores);
            }).not.toThrow();
        });

        it("should throw an error on score less than 1 in input", function () {
            var scores = [];
            for (var i = 0; i < 18; i++) {
                scores[i] = 0;
            }
            scores[17] = -3;

            expect(function () {
                scoringService.calculateInScore(scores);
            }).toThrow();
        })
    });

    describe("calculateTotalScore", function()
    {
        it("should throw an error if any input is not a number", function () {
            var undefinedScores = [];
            var letterScores = ["b"];
            var symbolScores = ["%"];

            function undefinedInputs ()
            {
                scoringService.calculateTotalScore(undefinedScores);
            }

            function letterInputs() {
                scoringService.calculateTotalScore(letterScores);
            }

            function symbolInputs() {
                scoringService.calculateTotalScore(symbolScores);
            }

            expect(undefinedInputs).toThrow();
            expect(letterInputs).toThrow();
            expect(symbolInputs).toThrow();
        });

        it("should output the total score for all 18 holes", function() {

        });
        it("should calculate even if not all scores are there", function() {

        });
        it("should throw an error on score less than 1 in input", function () {

        })
    });

    describe("compareToPar", function()
    {
        it("should throw an error if any input is not a number", function () {
            var undefinedScores = [];
            var letterScores = ["b"];
            var symbolScores = ["%"];

            function undefinedInputs ()
            {
                scoringService.calculateToPar(undefinedScores);
            }

            function letterInputs() {
                scoringService.calculateToPar(letterScores);
            }

            function symbolInputs() {
                scoringService.calculateToPar(symbolScores);
            }

            expect(undefinedInputs).toThrow();
            expect(letterInputs).toThrow();
            expect(symbolInputs).toThrow();
        });

        it("should output total score minus par", function () {
            
        });
        it("should throw an error on score less than 1 in input", function () {

        })
    });
});

