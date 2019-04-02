require 'rails_helper'

RSpec.describe Api::InvitesController, type: :controller do
  describe 'POST #create' do
    context 'valid params' do
      before do
        user = create(:user)
        @user2 = create(:user)
        event = create(:event, creator: user)

        add_authenticated_header(request, user)
        post :create, params: {hash: event.event_hash, user_id: @user2.id}

        @json = JSON.parse(response.body)
      end

      it 'should create the invite' do
        expect(response).to have_http_status(200)
        expect(Invite.count).to eql(1)
      end

      it 'should return the invite' do
        expect(@json['invite']['id']).to be_truthy
      end

      it 'should include the invited user' do
        expect(@json['invite']['user']).to be_truthy
        expect(@json['invite']['user']['id']).to eql(@user2.id)
      end

      it 'should not include the user\'s password' do
        expect(@json['invite']['user']['password_digest']).not_to be_truthy
      end
    end

    context 'invalid params' do
      it 'should return 404 when the event does not exist' do
        user = create(:user)
        @user2 = create(:user)
        event = create(:event, creator: user)

        add_authenticated_header(request, user)
        post :create, params: {hash: 'wrong', user_id: @user2.id}

        expect(response).to have_http_status(404)
      end


      it 'should return 404 when the user not exist' do
        user = create(:user)
        @user2 = create(:user)
        event = create(:event, creator: user)

        add_authenticated_header(request, user)
        post :create, params: {hash: event.event_hash, user_id: @user2.id + 1}

        expect(response).to have_http_status(404)
      end
    end

    context 'not in event' do
      it 'should refuse access if the user is not in the event' do
        user = create(:user)
        @user2 = create(:user)
        user3 = create(:user)
        event = create(:event, creator: user)

        add_authenticated_header(request, user3)
        post :create, params: {hash: event.event_hash, user_id: @user2.id}        

        expect(response).to have_http_status(401)
      end
    end

    context 'unauthorized' do
      it 'should refuse access if the user is not logged in' do
        user = create(:user)
        @user2 = create(:user)
        event = create(:event, creator: user)
        
        post :create, params: {hash: event.event_hash, user_id: @user2.id}        

        expect(response).to have_http_status(401)
      end
    end
  end

  describe 'GET #index' do
    context 'valid request' do

    end

    context 'unauthorized' do

    end
  end
  
  describe 'POST #accept' do
    context 'valid params' do

    end

    context 'invalid params' do

    end

    context 'unauthorized' do

    end
  end

  describe 'POST #refuse' do
    context 'valid params' do

    end

    context 'invalid params' do

    end

    context 'unauthorized' do

    end
  end
end
