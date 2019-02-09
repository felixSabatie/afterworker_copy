require 'rails_helper'

RSpec.describe DatePollOption, type: :model do

  before(:all) do
    @event = create(:event, creator: create(:user))
  end

  it 'should accept and save the date poll option' do
    date_poll_option = build(:date_poll_option, event: @event)
    expect(date_poll_option.save).to be true
  end

  context 'voters' do
    it 'should add the users to the voters' do
      user1 = create(:user)
      user2 = create(:user)
      date_poll_option = create(:date_poll_option, event: @event)
      date_poll_option.voters << user1 << user2

      expect(date_poll_option.voters.length).to eql(2)
    end

    it 'should add the user only once to the voters' do
      user1 = create(:user)
      date_poll_option = create(:date_poll_option, event: @event)
      date_poll_option.voters << user1

      expect { date_poll_option.voters << user1 }.to raise_error(ActiveRecord::RecordNotUnique)
      expect(date_poll_option.voters.length).to eql(1)
    end
  end
end
