require 'rails_helper'

RSpec.describe Api::DatePollController, type: :controller do
  describe 'POST #create' do
    context 'valid params' do
      before do
        user = create(:user)
        @user2 = create(:user)
        event = create(:event, creator: user)

        event.participants << @user2
        add_authenticated_header(request, @user2)
        post :create, params: {hash: event.event_hash,
                               date_poll_option: attributes_for(:date_poll_option, event: event)}
        @json = JSON.parse(response.body)
      end

      it 'should return code 200' do
        expect(response).to have_http_status(200)
      end

      it 'should create the date poll option' do
        expect(DatePollOption.count).to eq(1)
      end

      it 'should return the date poll option' do
        expect(@json['date_poll_option']['id']).to be_truthy
      end

      it 'should add the user to the date poll option voters' do
        expect(@json['date_poll_option']['voters'][0]['id']).to eql(@user2.id)
      end

      it 'shouldn\'t show the voter\'s password digest' do
        expect(@json['date_poll_option']['voters'][0]['password_digest']).not_to be_truthy
      end
    end

    context 'valid params and closed to suggestions' do
      before do
        @user = create(:user)
        user2 = create(:user)
        event = build(:event, creator: @user)
        event.is_open_to_dates = false
        event.save

        event.participants << user2
        add_authenticated_header(request, @user)
        post :create, params: {hash: event.event_hash,
                               date_poll_option: attributes_for(:date_poll_option, event: event)}
        @json = JSON.parse(response.body)
      end

      it 'should return code 200' do
        expect(response).to have_http_status(200)
      end

      it 'should create the date poll option' do
        expect(DatePollOption.count).to eq(1)
      end

      it 'should return the date poll option' do
        expect(@json['date_poll_option']['id']).to be_truthy
      end

      it 'should add the user to the date poll option voters' do
        expect(@json['date_poll_option']['voters'][0]['id']).to eql(@user.id)
      end

      it 'shouldn\'t show the voter\'s password digest' do
        expect(@json['date_poll_option']['voters'][0]['password_digest']).not_to be_truthy
      end
    end

    context 'wrong params' do
      it 'should return 404 when the event does not exist' do
        user = create(:user)
        user2 = create(:user)
        event = build(:event, creator: user)
        event.is_open_to_dates = false
        event.save

        event.participants << user2
        add_authenticated_header(request, user)
        post :create, params: {hash: 'wrong',
                               date_poll_option: attributes_for(:date_poll_option, event: event)}

        expect(response).to have_http_status(404)
      end
    end

    context 'unauthorized' do
      it 'should return 401 because the user is not logged in' do
        user = create(:user)
        user2 = create(:user)
        event = create(:event, creator: user)

        event.participants << user2
        post :create, params: {hash: event.event_hash,
                               date_poll_option: attributes_for(:date_poll_option, event: event)}

        expect(response).to have_http_status(401)
      end

      it 'should return 401 because the user cannot access the event' do
        user = create(:user)
        user2 = create(:user)
        event = create(:event, creator: user)

        add_authenticated_header(request, user2)
        post :create, params: {hash: event.event_hash,
                               date_poll_option: attributes_for(:date_poll_option, event: event)}

        expect(response).to have_http_status(401)
      end

      it 'should return 401 because the user cannot suggest dates' do
        user = create(:user)
        user2 = create(:user)
        event = build(:event, creator: user)
        event.is_open_to_dates = false
        event.save

        event.participants << user2
        add_authenticated_header(request, user2)
        post :create, params: {hash: event.event_hash,
                               date_poll_option: attributes_for(:date_poll_option, event: event)}

        expect(response).to have_http_status(401)
      end

      it 'should return 401 because the event does not have a date poll' do
        user = create(:user)
        event = build(:event, creator: user)
        event.has_date_poll = false
        event.save

        add_authenticated_header(request, user)
        post :create, params: {hash: event.event_hash,
                               date_poll_option: attributes_for(:date_poll_option, event: event)}

        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'POST #toggle' do
    context 'valid request' do
      before do
        user = create(:user)
        @user2 = create(:user)
        @event = create(:event, creator: user)
        @event.participants << @user2

        @date_poll_option = create(:date_poll_option, event: @event)
        @date_poll_option.voters << user

        add_authenticated_header(request, @user2)
      end

      it 'should add the user\'s vote' do
        post :toggle, params: {hash: @event.event_hash, id: @date_poll_option.id}

        expect(response).to have_http_status(200)
        expect(@date_poll_option.voters.length).to eql(2)
        expect(@date_poll_option.voters[1].id).to eql(@user2.id)
      end

      it 'should remove the user\'s vote' do
        @date_poll_option.voters << @user2
        post :toggle, params: {hash: @event.event_hash, id: @date_poll_option.id}

        @date_poll_option.reload
        expect(response).to have_http_status(200)
        expect(@date_poll_option.voters.length).to eql(1)
        expect(@date_poll_option.voters[0].id).not_to eql(@user2.id)
      end
    end

    context 'bad request' do
      before do
        user = create(:user)
        @user2 = create(:user)
        @event = create(:event, creator: user)
        @event.participants << @user2

        @date_poll_option = create(:date_poll_option, event: @event)
        @date_poll_option.voters << user

        add_authenticated_header(request, @user2)
      end

      it 'should return 404 when the event does not exist' do
        post :toggle, params: {hash: 'wrong', id: @date_poll_option.id}
        expect(response).to have_http_status(404)
      end

      it 'should return 404 when the date poll option does not exist' do
        post :toggle, params: {hash: @event.event_hash, id: @date_poll_option.id + 1}
        expect(response).to have_http_status(404)
      end
    end

    context 'unauthorized' do
      before do
        user = create(:user)
        @user2 = create(:user)
        @event = create(:event, creator: user)

        @date_poll_option = create(:date_poll_option, event: @event)
        @date_poll_option.voters << user
      end

      it 'should return 401 because the user is not logged in' do
        post :toggle, params: {hash: @event.event_hash, id: @date_poll_option.id}
        expect(response).to have_http_status(401)
      end

      it 'should return 401 because the user cannot access the event' do
        add_authenticated_header(request, @user2)

        post :toggle, params: {hash: @event.event_hash, id: @date_poll_option.id}
        expect(response).to have_http_status(401)
      end

      it 'should return 401 because the event does not have a date poll' do
        @event.participants << @user2
        @event.has_date_poll = false
        @event.save
        add_authenticated_header(request, @user2)

        post :toggle, params: {hash: @event.event_hash, id: @date_poll_option.id}
        expect(response).to have_http_status(401)
      end
    end
  end
end
