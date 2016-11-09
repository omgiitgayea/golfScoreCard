/**
 * Created by GodaiYuusaku on 11/3/16.
 */
function ScoringService()
{
    this.calculateOutScore = function (scores) {
        var out = 0;
        for(var i = 0; i < 9; i++)
        {
            out += scores[i]
        }
        return out;
    }

    this.calculateInScore = function (scores) {
        var inScore = 0;
        for(var i = 9; i < scores.length; i++)
        {
            inScore += scores[i]
        }
        return inScore;
    }
}

module.exports = ScoringService;